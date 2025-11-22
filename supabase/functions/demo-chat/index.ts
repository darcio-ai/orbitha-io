import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!, // <- usa o secret que você já criou
});

const SYSTEMS: Record<string, string> = {
  financeiro:
    "Você é o Financial Assistant da Orbitha. Seja direto, didático e prático. Faça no máximo 1 pergunta por vez. Evite texto longo.",
  business:
    "Você é o Business Assistant da Orbitha para MEI/PME. Seja objetivo e prático. Faça no máximo 1 pergunta por vez.",
  vendas:
    "Você é o Sales Assistant da Orbitha. Ajude com funil, script e KPIs. Faça no máximo 1 pergunta por vez.",
  marketing:
    "Você é o Marketing Assistant da Orbitha. Ajude com ICP, oferta e rotina simples. Faça no máximo 1 pergunta por vez.",
  suporte:
    "Você é o Support Assistant da Orbitha. Ajude com atendimento, automação e métricas. Faça no máximo 1 pergunta por vez.",
  viagens:
    "Você é o Travel Assistant da Orbitha. Ajude com roteiros, custos e logística. Faça no máximo 1 pergunta por vez.",
  fitness:
    "Você é o Fitness Assistant da Orbitha. Ajude com treino/nutrição geral. Não dê conselhos médicos. Faça no máximo 1 pergunta por vez.",
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { assistantId, userText, history } = body;

    const system =
      SYSTEMS[assistantId] ||
      "Você é um assistente da Orbitha. Seja objetivo e útil.";

    // histórico curtinho pra economizar token
    const safeHistory = Array.isArray(history) ? history.slice(-6) : [];

    const messages = [
      { role: "system", content: system },
      ...safeHistory.map((m: any) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: String(m.text || ""),
      })),
      { role: "user", content: String(userText || "") },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
      max_tokens: 220, // resposta curta = custo baixo
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Não consegui responder agora, tenta de novo 🙂";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Erro" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
