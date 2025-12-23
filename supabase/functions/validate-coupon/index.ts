import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Global limits by category
const GLOBAL_LIMITS = {
  assistente: 40,
  combo: 10,
};

// Coupons by category
const CATEGORY_COUPONS: Record<string, string[]> = {
  combo: ['BETANATAL-LB', 'BETANATAL-GR', 'BETANATAL-SU'],
  assistente: ['BETANATAL-FIN', 'BETANATAL-BUS', 'BETANATAL-VEN', 
               'BETANATAL-MKT', 'BETANATAL-SUP', 'BETANATAL-VIA', 'BETANATAL-FIT'],
};

// Get coupon category
const getCouponCategory = (code: string): 'assistente' | 'combo' | null => {
  if (CATEGORY_COUPONS.combo.includes(code)) {
    return 'combo';
  }
  if (CATEGORY_COUPONS.assistente.includes(code)) {
    return 'assistente';
  }
  return null;
};

interface ValidateCouponRequest {
  code: string;
  planType: string;
  planValue: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header", valid: false }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized", valid: false }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { code, planType, planValue }: ValidateCouponRequest = await req.json();
    console.log(`Validating coupon: ${code} for plan: ${planType} (R$${planValue})`);

    if (!code || !planType || planValue === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields", valid: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to query coupons
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch coupon
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .single();

    if (couponError || !coupon) {
      console.log("Coupon not found:", code);
      return new Response(
        JSON.stringify({ error: "Cupom não encontrado", valid: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if active
    if (!coupon.active) {
      return new Response(
        JSON.stringify({ error: "Cupom inativo", valid: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check validity dates
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);

    if (now < validFrom) {
      return new Response(
        JSON.stringify({ error: "Cupom ainda não está válido", valid: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (now > validUntil) {
      return new Response(
        JSON.stringify({ error: "Cupom expirado", valid: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check max uses (individual coupon limit)
    if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
      return new Response(
        JSON.stringify({ error: "Cupom esgotado", valid: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check global category limit for BETANATAL coupons
    const category = getCouponCategory(coupon.code);
    if (category) {
      const categoryCouponCodes = CATEGORY_COUPONS[category];
      const globalLimit = GLOBAL_LIMITS[category];

      // Fetch all coupons in this category and sum current_uses
      const { data: categoryCoupons, error: categoryError } = await supabaseAdmin
        .from("coupons")
        .select("current_uses")
        .in("code", categoryCouponCodes);

      if (categoryError) {
        console.error("Error fetching category coupons:", categoryError);
      } else {
        const totalCategoryUses = categoryCoupons?.reduce((sum, c) => sum + (c.current_uses || 0), 0) || 0;
        console.log(`Category ${category}: ${totalCategoryUses}/${globalLimit} uses`);

        if (totalCategoryUses >= globalLimit) {
          const categoryLabel = category === 'combo' ? 'combos' : 'assistentes individuais';
          return new Response(
            JSON.stringify({ 
              error: `Vagas beta para ${categoryLabel} esgotadas (${globalLimit}/${globalLimit})`, 
              valid: false 
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Check applicable plans
    if (coupon.applicable_plans && coupon.applicable_plans.length > 0) {
      if (!coupon.applicable_plans.includes(planType)) {
        return new Response(
          JSON.stringify({ error: "Cupom não aplicável a este plano", valid: false }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Check minimum plan value
    if (coupon.min_plan_value !== null && planValue < coupon.min_plan_value) {
      return new Response(
        JSON.stringify({ 
          error: `Valor mínimo do plano: R$ ${coupon.min_plan_value.toFixed(2)}`, 
          valid: false 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already used this coupon (optional - for single-use per user coupons)
    const { data: existingUsage } = await supabaseAdmin
      .from("coupon_usage")
      .select("id")
      .eq("coupon_id", coupon.id)
      .eq("user_id", user.id)
      .single();

    if (existingUsage && coupon.code === "PRIMEIRACOMPRA") {
      return new Response(
        JSON.stringify({ error: "Você já utilizou este cupom", valid: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate discount
    let discountAmount: number;
    if (coupon.discount_type === "percentage") {
      discountAmount = planValue * (coupon.discount_value / 100);
    } else {
      discountAmount = Math.min(coupon.discount_value, planValue);
    }

    const finalAmount = Math.max(0, planValue - discountAmount);

    console.log(`Coupon valid! Discount: R$${discountAmount.toFixed(2)}, Final: R$${finalAmount.toFixed(2)}`);

    return new Response(
      JSON.stringify({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
        },
        originalAmount: planValue,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Validate coupon error:", error);
    return new Response(
      JSON.stringify({ error: error.message, valid: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
