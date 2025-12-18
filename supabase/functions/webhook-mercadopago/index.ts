import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Agent URL mapping for each plan
const PLAN_AGENT_MAPPING: Record<string, string[]> = {
  life_balance: ['fitness', 'travel', 'financial'],
  growth: ['sales', 'marketing', 'support'],
  suite: ['fitness', 'travel', 'financial', 'sales', 'marketing', 'support', 'business']
};

const PLAN_NAMES: Record<string, string> = {
  life_balance: 'Life Balance',
  growth: 'Growth',
  suite: 'Suite Completa'
};

// Extrair plano do back_url (mais confiável que preço quando há cupom)
function getPlanTypeFromBackUrl(backUrl: string): string {
  try {
    const url = new URL(backUrl);
    const plan = url.searchParams.get('plan');
    if (plan && ['life_balance', 'growth', 'suite'].includes(plan)) {
      return plan;
    }
  } catch {
    // Se falhar, tenta extrair com regex
    const match = backUrl.match(/plan=([^&]+)/);
    if (match) {
      const plan = match[1];
      if (['life_balance', 'growth', 'suite'].includes(plan)) {
        return plan;
      }
    }
  }
  return 'unknown';
}

// Fallback: Mapeamento de preço para plano (valores originais sem desconto)
function getPlanTypeFromAmount(amount: number): string {
  if (amount === 67.00) return 'life_balance';
  if (amount === 97.00) return 'growth';
  if (amount === 147.00) return 'suite';
  return 'unknown';
}

// Validar assinatura HMAC-SHA256 do webhook
async function validateWebhookSignature(
  req: Request,
  body: string,
  webhookSecret: string
): Promise<boolean> {
  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  if (!xSignature || !xRequestId) {
    console.log("Missing signature headers");
    return false;
  }

  try {
    // Parse x-signature header: "ts=xxx,v1=yyy"
    const parts: Record<string, string> = {};
    xSignature.split(",").forEach(part => {
      const [key, value] = part.split("=");
      if (key && value) parts[key.trim()] = value.trim();
    });

    const ts = parts["ts"];
    const hash = parts["v1"];

    if (!ts || !hash) {
      console.log("Missing ts or v1 in signature");
      return false;
    }

    const data = JSON.parse(body);
    
    // Template conforme documentação: id:[data.id];request-id:[x-request-id];ts:[ts];
    const template = `id:${data.data?.id};request-id:${xRequestId};ts:${ts};`;
    
    // Gerar HMAC-SHA256
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(template)
    );

    const expectedHash = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    const isValid = hash === expectedHash;
    console.log("Signature validation:", isValid ? "VALID" : "INVALID");
    
    return isValid;
  } catch (error) {
    console.error("Signature validation error:", error);
    return false;
  }
}

serve(async (req) => {
  try {
    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    const MERCADOPAGO_WEBHOOK_SECRET = Deno.env.get("MERCADOPAGO_WEBHOOK_SECRET");

    if (!MERCADOPAGO_ACCESS_TOKEN) {
      console.error("MERCADOPAGO_ACCESS_TOKEN not configured");
      return new Response(JSON.stringify({ error: "Not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    console.log("Webhook received:", body);

    // Validar assinatura se secret estiver configurado
    if (MERCADOPAGO_WEBHOOK_SECRET) {
      const isValid = await validateWebhookSignature(req, body, MERCADOPAGO_WEBHOOK_SECRET);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      console.warn("MERCADOPAGO_WEBHOOK_SECRET not configured - skipping signature validation");
    }

    const data = JSON.parse(body);
    const { type, action, data: eventData } = data;

    console.log(`Processing event: type=${type}, action=${action}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Processar eventos de assinatura (subscription_preapproval)
    if (type === "subscription_preapproval") {
      const preapprovalId = eventData?.id;
      
      if (!preapprovalId) {
        console.error("Missing preapproval ID");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Buscar detalhes da assinatura
      const preapprovalResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${preapprovalId}`,
        {
          headers: { "Authorization": `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
        }
      );

      if (!preapprovalResponse.ok) {
        console.error("Failed to fetch preapproval details");
        return new Response(JSON.stringify({ error: "Failed to fetch preapproval" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      const preapproval = await preapprovalResponse.json();
      console.log("Preapproval details:", JSON.stringify(preapproval));

      const userId = preapproval.external_reference;
      const status = preapproval.status;
      const amount = preapproval.auto_recurring?.transaction_amount;
      const backUrl = preapproval.back_url || '';
      
      // Extrair plano primeiro do back_url (mais confiável com cupons), depois fallback para valor
      let planType = getPlanTypeFromBackUrl(backUrl);
      if (planType === 'unknown') {
        planType = getPlanTypeFromAmount(amount);
      }

      // Validar userId
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!userId || !uuidRegex.test(userId)) {
        console.error("Invalid userId in external_reference:", userId);
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log(`Processing subscription for user ${userId} - Status: ${status}, Plan: ${planType}`);

      // Buscar dados do usuário para email
      const { data: profileData } = await supabase
        .from("profiles")
        .select("email, firstname")
        .eq("id", userId)
        .single();

      if (status === "authorized") {
        // Assinatura autorizada - ativar acesso
        console.log("Subscription authorized - activating access");

        // Atualizar perfil
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_plan: planType,
            subscription_id: preapprovalId,
            subscription_amount: amount,
            subscription_start_date: new Date().toISOString(),
          })
          .eq("id", userId);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        } else {
          console.log("Profile updated successfully");

          // Enviar email de confirmação
          if (profileData?.email) {
            try {
              await supabase.functions.invoke("send-purchase-confirmation", {
                body: {
                  email: profileData.email,
                  name: profileData.firstname || "Cliente",
                  planName: PLAN_NAMES[planType] || planType,
                  amount: amount,
                },
              });
              console.log("Confirmation email sent");
            } catch (emailError) {
              console.error("Error sending email:", emailError);
            }
          }
        }

        // Liberar agentes do plano
        const agentUrls = PLAN_AGENT_MAPPING[planType] || [];
        console.log(`Plan ${planType} unlocks agents:`, agentUrls);

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
              agent_id: agent.id,
            }));

            const { error: accessError } = await supabase
              .from("agents_users")
              .upsert(agentAccess, {
                onConflict: "user_id,agent_id",
                ignoreDuplicates: true,
              });

            if (accessError) {
              console.error("Error granting agent access:", accessError);
            } else {
              console.log(`Granted access to ${agents.length} agents`);
            }
          }
        }

      } else if (status === "paused" || status === "cancelled") {
        // Assinatura pausada ou cancelada - revogar acesso
        console.log(`Subscription ${status} - revoking access`);

        await supabase
          .from("profiles")
          .update({
            subscription_status: status,
          })
          .eq("id", userId);

        // Revogar acesso aos agentes
        await supabase
          .from("agents_users")
          .delete()
          .eq("user_id", userId);

        console.log("Access revoked");
      }
    }

    // Processar eventos de pagamento (payment)
    if (type === "payment") {
      const paymentId = eventData?.id;
      
      if (!paymentId) {
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Buscar detalhes do pagamento
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: { "Authorization": `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
        }
      );

      if (paymentResponse.ok) {
        const payment = await paymentResponse.json();
        console.log("Payment details:", JSON.stringify(payment));

        // Pagamento aprovado de uma assinatura
        if (payment.status === "approved" && payment.metadata?.preapproval_id) {
          console.log("Payment approved for subscription:", payment.metadata.preapproval_id);
          // O evento de subscription_preapproval já cuidou da ativação
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
