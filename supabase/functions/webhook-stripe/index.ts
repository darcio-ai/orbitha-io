import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const signature = req.headers.get("stripe-signature");

    if (!signature || !endpointSecret) {
        console.error("Missing signature or webhook secret");
        return new Response("Missing signature or secret", {
            status: 400,
            headers: corsHeaders,
        });
    }

    try {
        const body = await req.text();

        let event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                endpointSecret,
            );
        } catch (err: any) {
            console.error(`Webhook signature verification failed:`, err.message);
            return new Response(`Webhook Error: ${err.message}`, {
                status: 400,
                headers: corsHeaders,
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
                console.log(`Updating subscription for user ${userId} - Plan: ${planType}`);

                const { error } = await supabase
                    .from("profiles")
                    .update({
                        stripe_customer_id: customerId,
                        subscription_status: "active",
                        subscription_plan: planType,
                        subscription_id: subscriptionId,
                    })
                    .eq("id", userId);

                if (error) {
                    console.error("Error updating profile:", error);
                } else {
                    console.log(`Successfully updated profile for user ${userId}`);
                }
            } else {
                console.warn("No user_id found in session metadata");
            }
        }

        if (event.type === "customer.subscription.updated") {
            const subscription = event.data.object as any;
            
            console.log(`Subscription updated: ${subscription.id} - Status: ${subscription.status}`);

            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("subscription_id", subscription.id)
                .single();

            if (profile) {
                const updateData: any = {
                    subscription_status: subscription.status,
                };

                if (subscription.current_period_end) {
                    updateData.subscription_end_date = new Date(subscription.current_period_end * 1000).toISOString();
                }

                const { error } = await supabase
                    .from("profiles")
                    .update(updateData)
                    .eq("id", profile.id);

                if (error) {
                    console.error("Error updating subscription status:", error);
                } else {
                    console.log(`Successfully updated subscription status for user ${profile.id}`);
                }
            } else {
                console.warn(`No profile found with subscription_id: ${subscription.id}`);
            }
        }

        if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object as any;
            
            console.log(`Subscription deleted: ${subscription.id}`);

            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("subscription_id", subscription.id)
                .single();

            if (profile) {
                const { error } = await supabase
                    .from("profiles")
                    .update({
                        subscription_status: "canceled",
                        subscription_end_date: new Date().toISOString(),
                    })
                    .eq("id", profile.id);

                if (error) {
                    console.error("Error updating canceled subscription:", error);
                } else {
                    console.log(`Successfully marked subscription as canceled for user ${profile.id}`);
                }
            } else {
                console.warn(`No profile found with subscription_id: ${subscription.id}`);
            }
        }

        return new Response(
            JSON.stringify({
                received: true,
            }),
            {
                headers: {
                    ...corsHeaders,
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
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
                status: 400,
            },
        );
    }
});
