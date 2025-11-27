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
        console.log("Starting create-checkout-asaas function");
        
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

        console.log("User authenticated:", user.id);

        const { planType, billingInfo, billingType = "BOLETO" } = await req.json();
        console.log("Plan type:", planType);
        console.log("Billing info:", billingInfo);
        console.log("Billing type:", billingType);

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

        console.log("Checking for existing customer...");
        
        // 1. Create or retrieve customer
        const customerResponse = await fetch(`${asaasApiUrl}/customers?email=${user.email}`, {
            headers: { access_token: asaasApiKey },
        });
        const customerData = await customerResponse.json();
        console.log("Customer check response:", customerData);

        let customerId = customerData.data && customerData.data.length > 0 ? customerData.data[0].id : null;

        if (!customerId) {
            console.log("Creating new customer...");
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
            console.log("New customer response:", newCustomer);
            if (newCustomer.errors) {
                throw new Error(`Error creating customer: ${JSON.stringify(newCustomer.errors)}`);
            }
            customerId = newCustomer.id;
        }
        
        console.log("Customer ID:", customerId);

        // Save billing info to user profile
        console.log("Updating user profile with billing info...");
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { data: profileData, error: profileError } = await supabaseAdmin
            .from("profiles")
            .update({
                cpf_cnpj: billingInfo?.cpfCnpj,
                billing_name: billingInfo?.name,
                asaas_customer_id: customerId
            })
            .eq("id", user.id)
            .select();

        if (profileError) {
            console.error("Error updating profile:", profileError);
        } else {
            console.log("Profile updated successfully:", profileData);
        }

        // 2. Create Payment
        console.log("Creating payment...");
        const paymentResponse = await fetch(`${asaasApiUrl}/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                access_token: asaasApiKey,
            },
            body: JSON.stringify({
                customer: customerId,
                billingType: billingType, // BOLETO or PIX
                value: value,
                dueDate: new Date().toISOString().split('T')[0], // Due today
                description: description,
                externalReference: user.id,
                postalService: false,
            }),
        });

        const paymentData = await paymentResponse.json();
        console.log("Payment response:", paymentData);

        if (paymentData.errors) {
            throw new Error(`Error creating payment: ${JSON.stringify(paymentData.errors)}`);
        }
        
        console.log("Payment created successfully!");

        return new Response(JSON.stringify({ url: paymentData.invoiceUrl, paymentId: paymentData.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error in create-checkout-asaas:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
