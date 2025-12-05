import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Agent URL mapping for each plan
const PLAN_AGENT_MAPPING: Record<string, string[]> = {
    life_balance: ['fitness', 'travel', 'financial'],
    growth: ['sales', 'marketing', 'support'],
    suite: ['fitness', 'travel', 'financial', 'sales', 'marketing', 'support', 'business']
};

// Webhook token for verification (set in Supabase secrets)
const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN");

serve(async (req) => {
    try {
        // Verify webhook token if configured
        if (ASAAS_WEBHOOK_TOKEN) {
            const providedToken = req.headers.get("asaas-access-token") || 
                                  req.headers.get("x-asaas-token") ||
                                  new URL(req.url).searchParams.get("token");
            
            if (providedToken !== ASAAS_WEBHOOK_TOKEN) {
                console.error("Invalid webhook token provided");
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    headers: { "Content-Type": "application/json" },
                    status: 401,
                });
            }
            console.log("Webhook token verified successfully");
        } else {
            console.warn("ASAAS_WEBHOOK_TOKEN not configured - accepting all requests (INSECURE)");
        }

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

            // Validate userId format (UUID)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!userId || !uuidRegex.test(userId)) {
                console.error("Invalid or missing userId in externalReference:", userId);
                return new Response(JSON.stringify({ error: "Invalid user reference" }), {
                    headers: { "Content-Type": "application/json" },
                    status: 400,
                });
            }

            // Infer plan type from value or description
            let planType = 'unknown';
            if (payment.value === 67.00 || payment.description?.includes('Life Balance')) {
                planType = 'life_balance';
            } else if (payment.value === 97.00 || payment.description?.includes('Growth')) {
                planType = 'growth';
            } else if (payment.value === 147.00 || payment.description?.includes('Suite')) {
                planType = 'suite';
            }

            if (userId && planType !== 'unknown') {
                console.log(`Updating subscription for user ${userId} - Plan: ${planType}`);
                
                // Get user email for confirmation
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("email, firstname")
                    .eq("id", userId)
                    .single();
                
                // Update profile
                const { error: profileError } = await supabase
                    .from("profiles")
                    .update({
                        asaas_customer_id: customerId,
                        subscription_status: 'active',
                        subscription_plan: planType,
                        subscription_id: paymentId,
                        subscription_amount: payment.value,
                        subscription_start_date: new Date().toISOString()
                    })
                    .eq("id", userId);

                if (profileError) {
                    console.error("Error updating profile:", profileError);
                } else {
                    console.log("Profile updated successfully");
                    
                    // Send purchase confirmation email
                    if (profileData?.email) {
                        try {
                            const planNames: Record<string, string> = {
                                life_balance: 'Life Balance',
                                growth: 'Growth',
                                suite: 'Suite Completa'
                            };
                            
                            await supabase.functions.invoke('send-purchase-confirmation', {
                                body: {
                                    email: profileData.email,
                                    name: profileData.firstname || 'Cliente',
                                    planName: planNames[planType] || planType,
                                    amount: payment.value
                                }
                            });
                            console.log("Purchase confirmation email sent");
                        } catch (emailError) {
                            console.error("Error sending confirmation email:", emailError);
                        }
                    }
                }

                // Get agents for this plan
                const agentUrls = PLAN_AGENT_MAPPING[planType] || [];
                console.log(`Plan ${planType} should unlock agents:`, agentUrls);

                if (agentUrls.length > 0) {
                    // Fetch agent IDs based on URLs
                    const { data: agents, error: agentsError } = await supabase
                        .from("agents")
                        .select("id, url")
                        .in("url", agentUrls)
                        .eq("status", "active");

                    if (agentsError) {
                        console.error("Error fetching agents:", agentsError);
                    } else if (agents && agents.length > 0) {
                        console.log(`Found ${agents.length} agents to unlock:`, agents);

                        // Insert agent access for each agent
                        const agentAccess = agents.map(agent => ({
                            user_id: userId,
                            agent_id: agent.id
                        }));

                        const { error: accessError } = await supabase
                            .from("agents_users")
                            .upsert(agentAccess, { 
                                onConflict: 'user_id,agent_id',
                                ignoreDuplicates: true 
                            });

                        if (accessError) {
                            console.error("Error granting agent access:", accessError);
                        } else {
                            console.log(`Successfully granted access to ${agents.length} agents for user ${userId}`);
                        }
                    } else {
                        console.warn(`No active agents found for URLs:`, agentUrls);
                    }
                }
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
