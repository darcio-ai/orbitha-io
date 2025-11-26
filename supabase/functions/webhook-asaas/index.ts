import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
    try {
        const body = await req.json();
        const { event, payment } = body;

        console.log(`Asaas Webhook Event: ${event}`);

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        if (event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED") {
            const userId = payment.externalReference;
            const customerId = payment.customer;

            if (userId) {
                console.log(`Updating subscription for user ${userId}`);
                await supabase
                    .from("profiles")
                    .update({
                        asaas_customer_id: customerId,
                        subscription_status: 'active',
                        plan_id: 'pro'
                    })
                    .eq("id", userId);
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Asaas Webhook Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }
});
