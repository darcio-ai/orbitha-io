import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
    try {
        const body = await req.json();
        const { event, payment } = body;

        console.log(`Processing Asaas event: ${event}`);

        // Check for confirmed payment events
        if (event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED") {
            const supabase = createClient(
                Deno.env.get("SUPABASE_URL") ?? "",
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
            );

            // We stored user_id in externalReference
            const userId = payment.externalReference;
            const customerId = payment.customer;
            const paymentId = payment.id;

            // Infer plan type from value or description
            let planType = 'unknown';
            if (payment.value === 97.00 || payment.description?.includes('Growth')) {
                planType = 'growth';
            } else if (payment.value === 147.00 || payment.description?.includes('Suite')) {
                planType = 'suite';
            }

            if (userId) {
                console.log(`Updating subscription for user ${userId}`);
                await supabase
                    .from("profiles")
                    .update({
                        asaas_customer_id: customerId,
                        subscription_status: 'active',
                        plan_type: planType,
                        billing_provider: 'asaas',
                        billing_provider_subscription_id: paymentId,
                        plan_id: planType
                    })
                    .eq("user_id", userId);
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Webhook handler error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }
});
