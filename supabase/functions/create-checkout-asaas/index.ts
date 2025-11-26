import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            {
                global: {
                    headers: { Authorization: req.headers.get("Authorization")! },
                },
            }
        );

        const {
            data: { user },
        } = await supabaseClient.auth.getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const { planType, billingInfo } = await req.json();

        if (!planType || (planType !== 'growth' && planType !== 'suite')) {
            throw new Error("Invalid plan type");
        }

        const value = planType === 'growth' ? 97.00 : 147.00;
        const description = planType === 'growth' ? "Assinatura Growth Pack" : "Assinatura Orbitha Suite";

        const asaasApiKey = Deno.env.get("ASAAS_API_KEY");
        const asaasApiUrl = Deno.env.get("ASAAS_API_URL");

        if (!asaasApiKey || !asaasApiUrl) {
            throw new Error("Asaas configuration missing");
        }

        // 1. Create or retrieve customer
        const customerResponse = await fetch(`${asaasApiUrl}/customers?email=${user.email}`, {
            headers: { access_token: asaasApiKey },
        });
        const customerData = await customerResponse.json();

        let customerId = customerData.data && customerData.data.length > 0 ? customerData.data[0].id : null;

        if (!customerId) {
            // Create new customer
            const newCustomerResponse = await fetch(`${asaasApiUrl}/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    access_token: asaasApiKey,
                },
                body: JSON.stringify({
                    name: billingInfo?.name || user.email,
                    email: user.email,
                    cpfCnpj: billingInfo?.cpfCnpj,
                }),
            });
            const newCustomer = await newCustomerResponse.json();
            if (newCustomer.errors) {
                throw new Error(`Error creating customer: ${JSON.stringify(newCustomer.errors)}`);
            }
            customerId = newCustomer.id;
        }

        // 2. Create Payment
        const paymentResponse = await fetch(`${asaasApiUrl}/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                access_token: asaasApiKey,
            },
            body: JSON.stringify({
                customer: customerId,
                billingType: "PIX", // Defaulting to PIX as requested, could be dynamic
                value: value,
                dueDate: new Date().toISOString().split('T')[0], // Due today
                description: description,
                externalReference: user.id, // Storing user_id in externalReference for easy retrieval
                postalService: false,
                // Asaas doesn't have a direct 'metadata' field in the same way as Stripe for the payment object in all versions,
                // but we can use description or externalReference. 
                // We will rely on externalReference for user_id and infer plan from value/description in webhook.
                // Alternatively, we can use the 'description' to store a JSON string if needed, but simple description is better for user.
            }),
        });

        const paymentData = await paymentResponse.json();

        if (paymentData.errors) {
            throw new Error(`Error creating payment: ${JSON.stringify(paymentData.errors)}`);
        }

        return new Response(JSON.stringify({ url: paymentData.invoiceUrl, paymentId: paymentData.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
