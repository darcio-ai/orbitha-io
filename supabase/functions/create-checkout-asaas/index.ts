import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { value, userId, billingInfo } = await req.json();
        const asaasUrl = Deno.env.get("ASAAS_API_URL") || "https://sandbox.asaas.com/api/v3";
        const asaasKey = Deno.env.get("ASAAS_API_KEY");

        if (!asaasKey) {
            throw new Error("ASAAS_API_KEY not configured");
        }

        console.log(`Creating Asaas payment for user: ${userId}`);

        // 1. Create Customer (or find existing - simplified here to always create/update)
        const customerResponse = await fetch(`${asaasUrl}/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access_token": asaasKey
            },
            body: JSON.stringify({
                name: billingInfo.name,
                email: billingInfo.email,
                cpfCnpj: billingInfo.cpfCnpj,
                externalReference: userId
            })
        });

        const customerData = await customerResponse.json();
        if (customerData.errors) {
            console.error("Asaas Customer Error:", customerData.errors);
            throw new Error(`Asaas Customer Error: ${customerData.errors[0].description}`);
        }

        const customerId = customerData.id;

        // 2. Create Payment
        const paymentResponse = await fetch(`${asaasUrl}/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access_token": asaasKey
            },
            body: JSON.stringify({
                customer: customerId,
                billingType: "PIX", // Default to PIX for now, can be parameterized
                value: value,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
                description: "Assinatura Orbitha AI",
                externalReference: userId
            })
        });

        const paymentData = await paymentResponse.json();
        if (paymentData.errors) {
            console.error("Asaas Payment Error:", paymentData.errors);
            throw new Error(`Asaas Payment Error: ${paymentData.errors[0].description}`);
        }

        return new Response(JSON.stringify({ paymentUrl: paymentData.invoiceUrl, id: paymentData.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error creating asaas checkout:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
