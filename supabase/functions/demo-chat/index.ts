import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!, // <- usa o secret que você já criou
});

// 1) BASE padrão (igual pra todos)
const BASE_SYSTEM = `
Você é um Assistente de IA da Orbitha. Seu objetivo é ajudar o usuário de forma prática, clara e acionável.

TOM & VOZ:
- Português do Brasil, humano, direto e cordial.
- Confiante sem ser arrogante.
- Sem jargão. Se usar termo técnico, explique em 1 frase simples.
- Não invente fatos. Se faltar dado, peça.

FORMATO OBRIGATÓRIO (todas as respostas):
1) Comece com **1 frase curta** resumindo entendimento do caso.
2) Depois use no máximo **2–3 seções**, com títulos em **negrito**.
3) Em cada seção use bullets "•" (máximo 4 bullets).
4) Se tiver conta/estimativa, mostre em **1 linha simples**.
5) Termine com **1 pergunta objetiva** para avançar (apenas 1).

LIMITES:
- Máx. ~140 palavras por resposta.
- Máx. 1 pergunta por resposta.
- Evite blocos longos.

Se houver conflito entre regras gerais e específicas, priorize as específicas.
`;

// 2) específico por assistente (o que muda)
const SPECIFIC_SYSTEMS: Record<string, string> = {
  financeiro: `
FOCO: finanças pessoais, organização, dívida, reserva, investimento básico.
- Priorize: clareza do cenário → controle → plano de ação.
`,
  business: `
FOCO: MEI/PME, margem, precificação, fluxo de caixa, obrigações.
- Traga 1 métrica chave por resposta (margem, ponto de equilíbrio etc.).
`,
  vendas: `
FOCO: processo comercial, funil, scripts, KPIs, rotina.
- Sugira sempre um próximo passo prático de execução.
`,
  marketing: `
FOCO: ICP, oferta, canais, conteúdo, funil.
- Busque: cliente ideal → promessa → canal principal.
`,
  suporte: `
FOCO: atendimento, automações, métricas de CS, processos.
- Priorize padronização, redução de retrabalho e experiência do cliente.
`,
  viagens: `
FOCO: roteiro, logística, custos, estilo de viagem.
- Organizado, empolgado e prático.
`,
  fitness: `
FOCO: treino, nutrição geral, hábitos.
- Não prescreva tratamentos médicos; só orientação geral segura.
`,
};

// 3) SYSTEM final = BASE + específico
const SYSTEMS: Record<string, string> = {
  financeiro: BASE_SYSTEM + "\n" + SPECIFIC_SYSTEMS.financeiro,
  business: BASE_SYSTEM + "\n" + SPECIFIC_SYSTEMS.business,
  vendas: BASE_SYSTEM + "\n" + SPECIFIC_SYSTEMS.vendas,
  marketing: BASE_SYSTEM + "\n" + SPECIFIC_SYSTEMS.marketing,
  suporte: BASE_SYSTEM + "\n" + SPECIFIC_SYSTEMS.suporte,
  viagens: BASE_SYSTEM + "\n" + SPECIFIC_SYSTEMS.viagens,
  fitness: BASE_SYSTEM + "\n" + SPECIFIC_SYSTEMS.fitness,
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { assistantId, userText, history } = body;

    const system = SYSTEMS[assistantId] || "Você é um assistente da Orbitha. Seja objetivo e útil.";

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

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Não consegui responder agora, tenta de novo 🙂";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Erro" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
