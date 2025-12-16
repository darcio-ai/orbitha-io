import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const PLAN_AGENT_MAPPING: Record<string, string[]> = {
  life_balance: ['fitness', 'travel', 'financial'],
  growth: ['sales', 'marketing', 'support'],
  suite: ['fitness', 'travel', 'financial', 'sales', 'marketing', 'support', 'business']
};

const ABACATEPAY_WEBHOOK_SECRET = Deno.env.get("ABACATEPAY_WEBHOOK_SECRET");

serve(async (req) => {
  try {
    // Validate webhook secret
    if (!ABACATEPAY_WEBHOOK_SECRET) {
      console.error("ABACATEPAY_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Webhook not configured" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Check secret via query param (as per Abacate Pay docs)
    const url = new URL(req.url);
    const webhookSecret = url.searchParams.get("webhookSecret");

    if (webhookSecret !== ABACATEPAY_WEBHOOK_SECRET) {
      console.error("Invalid webhook secret");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      });
    }

    console.log("Webhook secret verified");

    const body = await req.json();
    const { event, data } = body;

    console.log(`Processing Abacate Pay event: ${event}`);
    console.log("Webhook payload:", JSON.stringify(body, null, 2));

    if (event === "billing.paid") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const amount = data?.payment?.amount;
      const billingId = data?.billing?.id;
      const customerEmail = data?.billing?.customer?.metadata?.email;
      const productExternalId = data?.billing?.products?.[0]?.externalId;

      console.log(`Customer email: ${customerEmail}, Product: ${productExternalId}`);

      // Validate customer email
      if (!customerEmail) {
        console.error("Customer email not found in webhook payload");
        return new Response(JSON.stringify({ error: "Customer email required" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Find user by email
      const { data: profile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("id, firstname")
        .eq("email", customerEmail)
        .maybeSingle();

      if (profileFetchError || !profile) {
        console.error("User not found for email:", customerEmail, profileFetchError);
        return new Response(JSON.stringify({ error: "User not found" }), {
          headers: { "Content-Type": "application/json" },
          status: 404,
        });
      }

      const userId = profile.id;
      console.log(`Found user: ${userId} for email: ${customerEmail}`);

      // Infer plan type from product externalId or amount
      let planType = 'unknown';
      if (productExternalId?.startsWith('plan-')) {
        planType = productExternalId.replace('plan-', '').replace('_', '_');
      } else if (amount === 6700) planType = 'life_balance';
      else if (amount === 9700) planType = 'growth';
      else if (amount === 14700) planType = 'suite';

      console.log(`User: ${userId}, Amount: ${amount}, Plan: ${planType}`);

      if (planType !== 'unknown') {
        console.log(`Processing subscription: userId=${userId}, plan=${planType}, amount=${amount}`);

        // Update profile subscription
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_status: 'active',
            subscription_plan: planType,
            subscription_id: billingId,
            subscription_amount: amount / 100,
            subscription_start_date: new Date().toISOString()
          })
          .eq("id", userId);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        } else {
          console.log("Profile updated successfully");

          // Send confirmation email
          try {
            const planNames: Record<string, string> = {
              life_balance: 'Life Balance',
              growth: 'Growth',
              suite: 'Suite Completa'
            };

            await supabase.functions.invoke('send-purchase-confirmation', {
              body: {
                email: customerEmail,
                name: profile.firstname || 'Cliente',
                planName: planNames[planType] || planType,
                amount: amount / 100
              }
            });
            console.log("Confirmation email sent to:", customerEmail);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
        }

        // Grant agent access
        const agentUrls = PLAN_AGENT_MAPPING[planType] || [];
        console.log(`Unlocking agents for plan ${planType}:`, agentUrls);

        if (agentUrls.length > 0) {
          const { data: agents, error: agentsError } = await supabase
            .from("agents")
            .select("id, url")
            .in("url", agentUrls)
            .eq("status", "active");

          if (agentsError) {
            console.error("Error fetching agents:", agentsError);
          } else if (agents && agents.length > 0) {
            console.log(`Found ${agents.length} agents to unlock`);

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
              console.log(`Granted access to ${agents.length} agents for user ${userId}`);
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
