import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Configuração dos planos (IDs serão atualizados após criar no Mercado Pago)
const PLAN_CONFIG: Record<string, { name: string; price: number; preapprovalPlanId?: string }> = {
  life_balance: {
    name: "Orbitha Life Balance Pack",
    price: 67.00,
    preapprovalPlanId: Deno.env.get("MP_PLAN_LIFE_BALANCE") || "",
  },
  growth: {
    name: "Orbitha Growth Pack",
    price: 97.00,
    preapprovalPlanId: Deno.env.get("MP_PLAN_GROWTH") || "",
  },
  suite: {
    name: "Orbitha Suite Completa",
    price: 147.00,
    preapprovalPlanId: Deno.env.get("MP_PLAN_SUITE") || "",
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

    const { planType, billingInfo } = await req.json();
    console.log("Creating checkout for plan:", planType, "user:", user.id);

    const planConfig = PLAN_CONFIG[planType];
    if (!planConfig) {
      return new Response(
        JSON.stringify({ error: "Invalid plan type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get origin for back_url
    const origin = req.headers.get("origin") || "https://orbitha.com.br";

    // Criar assinatura recorrente via Preapproval API
    const preapprovalData = {
      reason: planConfig.name,
      external_reference: user.id,
      payer_email: billingInfo.email,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: planConfig.price,
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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin.from("profiles").update({
      billing_name: billingInfo.name,
      cpf_cnpj: billingInfo.cpfCnpj,
    }).eq("id", user.id);

    return new Response(
      JSON.stringify({
        init_point: result.init_point,
        subscription_id: result.id,
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
