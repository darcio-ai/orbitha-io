import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ABACATEPAY_API_URL = Deno.env.get("ABACATEPAY_API_URL") || "https://api.abacatepay.com";
const ABACATEPAY_API_KEY = Deno.env.get("ABACATEPAY_API_KEY");

const planConfig: Record<string, { price: number; name: string }> = {
  life_balance: { price: 6700, name: "Life Balance Pack" },
  growth: { price: 9700, name: "Growth Pack" },
  suite: { price: 14700, name: "Orbitha Suite" }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ABACATEPAY_API_KEY) {
      throw new Error("ABACATEPAY_API_KEY not configured");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    const { planType, billingInfo, paymentMethod } = await req.json();

    if (!planType || !planConfig[planType]) {
      throw new Error("Invalid plan type");
    }

    if (!billingInfo?.name || !billingInfo?.email || !billingInfo?.cpfCnpj) {
      throw new Error("Missing billing information");
    }

    const plan = planConfig[planType];
    const siteUrl = Deno.env.get("SITE_URL") || "https://orbitha.com.br";

    console.log(`Creating Abacate Pay billing for user ${user.id}, plan: ${planType}, method: ${paymentMethod}`);

    // Create billing on Abacate Pay
    const billingPayload = {
      frequency: "ONE_TIME",
      methods: [paymentMethod || "PIX"],
      products: [{
        externalId: `plan-${planType}`,
        name: plan.name,
        quantity: 1,
        price: plan.price
      }],
      returnUrl: `${siteUrl}/pricing`,
      completionUrl: `${siteUrl}/dashboard?payment=success`,
      externalId: user.id,
      customer: {
        name: billingInfo.name,
        cellphone: billingInfo.cellphone || "(00) 00000-0000",
        email: billingInfo.email,
        taxId: billingInfo.cpfCnpj.replace(/\D/g, '')
      }
    };

    console.log("Abacate Pay payload:", JSON.stringify(billingPayload, null, 2));

    const response = await fetch(`${ABACATEPAY_API_URL}/v1/billing/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(billingPayload)
    });

    const responseText = await response.text();
    console.log("Abacate Pay response status:", response.status);
    console.log("Abacate Pay response:", responseText);

    if (!response.ok) {
      throw new Error(`Abacate Pay error: ${responseText}`);
    }

    const data = JSON.parse(responseText);

    if (!data.data?.url) {
      throw new Error("No payment URL returned from Abacate Pay");
    }

    // Save billing info to profile
    await supabase
      .from("profiles")
      .update({
        billing_name: billingInfo.name,
        cpf_cnpj: billingInfo.cpfCnpj
      })
      .eq("id", user.id);

    return new Response(JSON.stringify({ url: data.data.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error creating Abacate Pay checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
