import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ✅ OpenAI key segura
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY não configurada nos Secrets do Supabase");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * 1) BASE padrão (igual pra todos)
 *    Regras duras pra evitar blocão e deixar leitura agradável
 */
const BASE_SYSTEM = `
Você é um Assistente de IA da Orbitha. Ajude de forma prática, clara e acionável.

ESCREVA SEMPRE EM FORMATO ESCANEÁVEL:
- Máximo de 120 palavras.
- Máximo de 3 seções.
- Cada seção deve ter título em **negrito**.
- Cada seção deve ter no máximo 3 bullets.
- Bullets curtos (1 linha cada).
- Proibido parágrafo longo.
- Proibido lista numerada longa (1.,2.,3.,4...).
- Se precisar orientar mais, priorize só o essencial.
- Termine com 1 pergunta objetiva.

Se houver conflito entre regras gerais e específicas, priorize as específicas.
`;

/**
 * 2) específico por assistente (o que muda)
 */
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
FOCO: treino, nutrição geral, hábitos para emagrecimento seguro.
- Não prescreva dieta clínica nem tratamento médico.
- Dê só um plano inicial simples (1 semana).
- Linguagem motivadora e bem curta.
`,
};

/**
 * 3) SYSTEM final = BASE + específico
 */
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

    // ✅ fallback correto
    const system = SYSTEMS[assistantId] || BASE_SYSTEM;

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

    // --- força o modelo a responder em JSON curto ---
const jsonInstruction = `
Responda APENAS em JSON válido (nada fora do JSON), neste formato:
{
  "summary": "1 frase curta de resumo",
  "sections": [
    { "title": "Título curto", "bullets": ["bullet curto", "bullet curto"] }
  ],
  "question": "1 pergunta objetiva"
}

REGRAS:
- Máx. 120 palavras no TOTAL.
- Máx. 3 seções.
- Máx. 3 bullets por seção.
- Bullets de 1 linha.
`;

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: system + "\n\n" + jsonInstruction },
    ...safeHistory.map((m: any) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: String(m.text || ""),
    })),
    { role: "user", content: String(userText || "") },
  ],
  response_format: { type: "json_object" },
  temperature: 0.2,
  max_tokens: 220, // JSON tem overhead, mas ainda barato
});

// --- converte JSON em resposta Orbitha bonita ---
let data: any = null;
const raw = completion.choices?.[0]?.message?.content || "";

try {
  data = JSON.parse(raw);
} catch {
  // fallback se vier algo fora do JSON
  data = {
    summary: raw.slice(0, 120),
    sections: [],
    question: "Quer que eu detalhe em 3 passos práticos?",
  };
}

// sanitiza tamanho/quantidade
const sections = Array.isArray(data.sections) ? data.sections.slice(0, 3) : [];
const formattedSections = sections.map((s: any) => {
  const title = String(s.title || "").trim();
  const bullets = Array.isArray(s.bullets) ? s.bullets.slice(0, 3) : [];
  const cleanBullets = bullets
    .map((b: any) => String(b).trim())
    .filter(Boolean);

  if (!title && cleanBullets.length === 0) return null;

  return `**${title || "Pontos principais"}**\n• ${cleanBullets.join("\n• ")}`;
}).filter(Boolean) as string[];

const replyParts = [
  data.summary ? `**${String(data.summary).trim()}**` : null,
  ...formattedSections,
  data.question ? String(data.question).trim() : null,
].filter(Boolean);

const reply = replyParts.join("\n\n");

    });
  }
});
