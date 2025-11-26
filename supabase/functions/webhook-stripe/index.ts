import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

serve(async (req) => {
    const signature = req.headers.get("stripe-signature");

    if (!signature || !endpointSecret) {
        return new Response("Missing signature or secret", {
            status: 400,
        });
    }

    try {
        const body = await req.text();

        let event;
        try {
            // Fixed: Using constructEventAsync for Deno environment
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                endpointSecret,
            );
        } catch (err: any) {
            console.error(`Webhook signature verification failed.`, err.message);
            return new Response(`Webhook Error: ${err.message}`, {
                status: 400,
            });
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        );

        console.log(`Processing Stripe event: ${event.type}`);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as any;

            const userId = session.metadata?.user_id;
            const planType = session.metadata?.plan_type;
            const customerId = session.customer;
            const subscriptionId = session.subscription;

            if (userId) {
                console.log(`Updating subscription for user ${userId}`);

                const { error } = await supabase
                    .from("profiles")
                    .update({
                        stripe_customer_id: customerId,
                        subscription_status: "active",
                        plan_type: planType,
                        billing_provider: "stripe",
                        billing_provider_subscription_id: subscriptionId,
                        plan_id: planType,
                    })
                    .eq("user_id", userId);

                if (error) {
                    console.error("Error updating profile:", error);
                }
            } else {
                console.warn("No user_id found in session metadata");
            }
        }

        return new Response(
            JSON.stringify({
                received: true,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 200,
            },
        );
    } catch (error: any) {
        console.error("Webhook handler error:", error);
        return new Response(
            JSON.stringify({
                error: error.message,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 400,
            },
        );
    }
});
