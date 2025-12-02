import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Agent URL mapping for each plan (same as real webhook)
const PLAN_AGENT_MAPPING: Record<string, string[]> = {
    life_balance: ['fitness', 'travel', 'financial'],
    growth: ['sales', 'marketing', 'support'],
    suite: ['fitness', 'travel', 'financial', 'sales', 'marketing', 'support', 'business']
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { user_id, plan_type } = await req.json();

        console.log(`[TEST] Simulating webhook for user: ${user_id}, plan: ${plan_type}`);

        if (!user_id || !plan_type) {
            return new Response(
                JSON.stringify({ error: "user_id and plan_type are required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (!['life_balance', 'growth', 'suite'].includes(plan_type)) {
            return new Response(
                JSON.stringify({ error: "Invalid plan_type. Must be: life_balance, growth, or suite" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // Step 1: Update profile with subscription info
        console.log(`[TEST] Updating profile for user ${user_id} - Plan: ${plan_type}`);
        
        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                subscription_status: 'active',
                subscription_plan: plan_type,
                subscription_id: `test_${plan_type}_${Date.now()}`
            })
            .eq("id", user_id);

        if (profileError) {
            console.error("[TEST] Error updating profile:", profileError);
            return new Response(
                JSON.stringify({ error: "Failed to update profile", details: profileError }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
        console.log("[TEST] Profile updated successfully");

        // Step 2: Get agents for this plan
        const agentUrls = PLAN_AGENT_MAPPING[plan_type] || [];
        console.log(`[TEST] Plan ${plan_type} should unlock agents:`, agentUrls);

        // Step 3: Fetch agent IDs based on URLs
        const { data: agents, error: agentsError } = await supabase
            .from("agents")
            .select("id, url, name")
            .in("url", agentUrls)
            .eq("status", "active");

        if (agentsError) {
            console.error("[TEST] Error fetching agents:", agentsError);
            return new Response(
                JSON.stringify({ error: "Failed to fetch agents", details: agentsError }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log(`[TEST] Found ${agents?.length || 0} agents:`, agents);

        if (!agents || agents.length === 0) {
            return new Response(
                JSON.stringify({ 
                    warning: "No active agents found for plan",
                    plan_type,
                    expected_urls: agentUrls,
                    profile_updated: true,
                    agents_assigned: 0
                }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Step 4: Insert agent access for each agent
        const agentAccess = agents.map(agent => ({
            user_id: user_id,
            agent_id: agent.id
        }));

        const { error: accessError } = await supabase
            .from("agents_users")
            .upsert(agentAccess, { 
                onConflict: 'user_id,agent_id',
                ignoreDuplicates: true 
            });

        if (accessError) {
            console.error("[TEST] Error granting agent access:", accessError);
            return new Response(
                JSON.stringify({ error: "Failed to grant agent access", details: accessError }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log(`[TEST] Successfully granted access to ${agents.length} agents for user ${user_id}`);

        // Return success with details
        return new Response(
            JSON.stringify({
                success: true,
                user_id,
                plan_type,
                profile_updated: true,
                agents_assigned: agents.map(a => ({ id: a.id, name: a.name, url: a.url }))
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("[TEST] Webhook test error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
