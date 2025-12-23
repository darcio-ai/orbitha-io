import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mapeamento de cupons BETANATAL para IDs dos assistentes
const COUPON_AGENTS: Record<string, string[]> = {
  // Cupons individuais
  "BETANATAL-FIN": ["5fe72ccc-0242-4c94-b701-58bcb64cfa62"], // Financeiro
  "BETANATAL-FIT": ["cccab8ba-050f-4b53-bfcc-b4534b091586"], // Fitness
  "BETANATAL-BUS": ["06f8ba41-9b11-42fa-a905-aee1d54d5486"], // Business
  "BETANATAL-VEN": ["d0a28e29-24da-4466-97d5-4b97e0c8d52a"], // Vendas
  "BETANATAL-MKT": ["42b97f52-6c03-41c3-ac9c-673b7d5f9d1b"], // Marketing
  "BETANATAL-SUP": ["59c982cc-5eaa-4264-bbf1-04a467256a08"], // Suporte
  "BETANATAL-VIA": ["fc853360-586d-4e21-b723-2ab3dcff9b33"], // Viagens
  
  // Cupons combo
  "BETANATAL-LB": [ // Life Balance: Financeiro + Fitness + Viagens
    "5fe72ccc-0242-4c94-b701-58bcb64cfa62",
    "cccab8ba-050f-4b53-bfcc-b4534b091586",
    "fc853360-586d-4e21-b723-2ab3dcff9b33",
  ],
  "BETANATAL-GR": [ // Growth: Vendas + Marketing + Suporte
    "d0a28e29-24da-4466-97d5-4b97e0c8d52a",
    "42b97f52-6c03-41c3-ac9c-673b7d5f9d1b",
    "59c982cc-5eaa-4264-bbf1-04a467256a08",
  ],
  "BETANATAL-SU": [ // Suite: Todos os 7
    "06f8ba41-9b11-42fa-a905-aee1d54d5486",
    "5fe72ccc-0242-4c94-b701-58bcb64cfa62",
    "cccab8ba-050f-4b53-bfcc-b4534b091586",
    "fc853360-586d-4e21-b723-2ab3dcff9b33",
    "d0a28e29-24da-4466-97d5-4b97e0c8d52a",
    "42b97f52-6c03-41c3-ac9c-673b7d5f9d1b",
    "59c982cc-5eaa-4264-bbf1-04a467256a08",
  ],
};

// Configuração dos planos
const PLAN_CONFIG: Record<string, { name: string; price: number }> = {
  life_balance: {
    name: "Orbitha Life Balance Pack",
    price: 67.00,
  },
  growth: {
    name: "Orbitha Growth Pack",
    price: 97.00,
  },
  suite: {
    name: "Orbitha Suite Completa",
    price: 147.00,
  },
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      console.error("MERCADOPAGO_ACCESS_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
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
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { planType, billingInfo, couponCode } = await req.json();
    console.log("Creating checkout for plan:", planType, "user:", user.id, "coupon:", couponCode || "none");

    const planConfig = PLAN_CONFIG[planType];
    if (!planConfig) {
      return new Response(
        JSON.stringify({ error: "Invalid plan type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let finalPrice = planConfig.price;
    let discountAmount = 0;
    let couponData: any = null;

    // Validate and apply coupon if provided
    if (couponCode) {
      const { data: coupon, error: couponError } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase().trim())
        .single();

      if (couponError || !coupon) {
        return new Response(
          JSON.stringify({ error: "Cupom inválido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate coupon
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = new Date(coupon.valid_until);

      if (!coupon.active) {
        return new Response(
          JSON.stringify({ error: "Cupom inativo" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (now < validFrom || now > validUntil) {
        return new Response(
          JSON.stringify({ error: "Cupom fora da validade" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
        return new Response(
          JSON.stringify({ error: "Cupom esgotado" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (coupon.applicable_plans && coupon.applicable_plans.length > 0 && !coupon.applicable_plans.includes(planType)) {
        return new Response(
          JSON.stringify({ error: "Cupom não aplicável a este plano" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Calculate discount
      if (coupon.discount_type === "percentage") {
        discountAmount = planConfig.price * (coupon.discount_value / 100);
      } else {
        discountAmount = Math.min(coupon.discount_value, planConfig.price);
      }

      finalPrice = Math.max(0, planConfig.price - discountAmount);
      couponData = coupon;

      console.log(`Coupon applied: ${couponCode}, discount: R$${discountAmount.toFixed(2)}, final: R$${finalPrice.toFixed(2)}`);
    }

    // If final price is 0 (100% discount), activate subscription directly without payment
    if (finalPrice <= 0) {
      console.log("100% discount - activating subscription directly without payment");

      // Update profile with subscription info
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

      // Check if this is a beta coupon (BETANATAL)
      const isBetaCoupon = couponCode && couponCode.toUpperCase().includes("BETANATAL") && !couponCode.toUpperCase().includes("BETANATAL50");
      const betaExpiresAt = isBetaCoupon ? new Date("2025-01-15T23:59:59-03:00").toISOString() : null;

      const profileUpdate: Record<string, any> = {
        billing_name: billingInfo.name,
        cpf_cnpj: billingInfo.cpfCnpj,
        subscription_status: "active",
        subscription_plan: planType,
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: subscriptionEndDate.toISOString(),
        subscription_amount: 0,
        plan: planType,
      };

      // Add beta user fields if using BETANATAL coupon
      if (isBetaCoupon) {
        profileUpdate.is_beta_user = true;
        profileUpdate.beta_source = couponCode.toUpperCase();
        profileUpdate.beta_assistant_choice = planType; // Store which plan/assistant they chose
        profileUpdate.beta_expires_at = betaExpiresAt;
        console.log("Beta user detected - marking profile with beta fields");
      }

      await supabaseAdmin.from("profiles").update(profileUpdate).eq("id", user.id);

      // Record coupon usage
      if (couponData) {
        await supabaseAdmin
          .from("coupons")
          .update({ current_uses: couponData.current_uses + 1 })
          .eq("id", couponData.id);

        await supabaseAdmin.from("coupon_usage").insert({
          coupon_id: couponData.id,
          user_id: user.id,
          plan_type: planType,
          original_amount: planConfig.price,
          discount_amount: discountAmount,
          final_amount: 0,
        });

        console.log("Coupon usage recorded for user:", user.id);
      }

      // Assign agents based on coupon code
      if (isBetaCoupon && couponCode) {
        const upperCouponCode = couponCode.toUpperCase().trim();
        const agentIds = COUPON_AGENTS[upperCouponCode] || [];
        
        if (agentIds.length > 0) {
          console.log(`Assigning ${agentIds.length} agents for coupon ${upperCouponCode}`);
          
          for (const agentId of agentIds) {
            const { error: insertError } = await supabaseAdmin
              .from("agents_users")
              .upsert(
                { user_id: user.id, agent_id: agentId },
                { onConflict: "user_id,agent_id" }
              );
            
            if (insertError) {
              console.error(`Error assigning agent ${agentId}:`, insertError);
            } else {
              console.log(`Agent ${agentId} assigned to user ${user.id}`);
            }
          }
        } else {
          console.log(`No agents mapped for coupon ${upperCouponCode}`);
        }
      }

      // Record sale
      await supabaseAdmin.from("sales").insert({
        user_id: user.id,
        product_name: planConfig.name,
        product_type: "subscription",
        amount: 0,
        acquisition_channel: "mercadopago",
        payment_method: "coupon_100",
        status: "completed",
      });

      const origin = req.headers.get("origin") || "https://orbitha.com.br";

      return new Response(
        JSON.stringify({
          init_point: null,
          subscription_id: `free_${user.id}_${Date.now()}`,
          original_amount: planConfig.price,
          discount_amount: discountAmount,
          final_amount: 0,
          free_activation: true,
          redirect_url: `${origin}/pricing?status=done&plan=${planType}`,
          is_beta_user: isBetaCoupon,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get origin for back_url
    const origin = req.headers.get("origin") || "https://orbitha.com.br";

    // Criar assinatura recorrente via Preapproval API
    const preapprovalData = {
      reason: couponData 
        ? `${planConfig.name} (cupom: ${couponCode})` 
        : planConfig.name,
      external_reference: user.id,
      payer_email: billingInfo.email,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: finalPrice,
        currency_id: "BRL",
      },
      back_url: `${origin}/pricing?status=done&plan=${planType}`,
      status: "pending",
    };

    console.log("Creating preapproval:", JSON.stringify(preapprovalData));

    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preapprovalData),
    });

    const result = await response.json();
    console.log("Mercado Pago response:", JSON.stringify(result));

    if (!response.ok) {
      console.error("Mercado Pago error:", result);
      return new Response(
        JSON.stringify({ error: result.message || "Failed to create subscription" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Atualizar perfil com billing info
    await supabaseAdmin.from("profiles").update({
      billing_name: billingInfo.name,
      cpf_cnpj: billingInfo.cpfCnpj,
    }).eq("id", user.id);

    // Record coupon usage if used
    if (couponData) {
      // Increment coupon usage
      await supabaseAdmin
        .from("coupons")
        .update({ current_uses: couponData.current_uses + 1 })
        .eq("id", couponData.id);

      // Record usage history
      await supabaseAdmin.from("coupon_usage").insert({
        coupon_id: couponData.id,
        user_id: user.id,
        plan_type: planType,
        original_amount: planConfig.price,
        discount_amount: discountAmount,
        final_amount: finalPrice,
      });

      console.log("Coupon usage recorded for user:", user.id);
    }

    return new Response(
      JSON.stringify({
        init_point: result.init_point,
        subscription_id: result.id,
        original_amount: planConfig.price,
        discount_amount: discountAmount,
        final_amount: finalPrice,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
