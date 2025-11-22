import { Check, TrendingUp, Target, MessageSquare, Timer, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import agenteVendas from "@/assets/agente_vendas.png";

const SalesAssistant = () => {
  const steps = [
    {
      icon: "1️⃣",
      title: "Conte seu cenário",
      description: "Segmento, ICP, ticket, ciclo, canais, time e onde o funil trava hoje.",
    },
    {
      icon: "2️⃣",
      title: "Receba o plano",
      description: "Diagnóstico + hipóteses claras + próximas ações priorizadas.",
    },
    {
      icon: "3️⃣",
      title: "Execute com scripts",
      description: "Cadências, emails, roteiros SPIN, negociação e follow-ups prontos.",
    },
  ];

  const premiumDelivers = [
    "Diagnóstico comercial completo (ICP, funil, cadência, taxa de conversão)",
    "Playbook por etapa do funil (prospecção → discovery → proposta → fechamento)",
    "Roteiro SPIN Selling com perguntas adaptadas ao seu produto/serviço",
    "Cadência outbound/inbound pronta (email, LinkedIn, WhatsApp, call)",
    "Templates de cold email, mensagem LinkedIn e follow-up persuasivo",
    "Kit de objeções (preço, timing, concorrente, decisor, prioridade)",
    "Sugestão de CRM ideal + setup de pipeline e atividades",
    "Plano 7/14/30 dias para destravar resultados",
  ];

  const benefits = [
    {
      icon: "📈",
      title: "Mais conversão",
      description: "Abordagem consultiva que faz o cliente se convencer.",
    },
    {
      icon: "🎯",
      title: "Prospecção eficiente",
      description: "Cadências realistas que geram resposta de verdade.",
    },
    {
      icon: "🧩",
      title: "Pipeline organizado",
      description: "Processo claro pra não perder oportunidades.",
    },
    {
      icon: "⚡",
      title: "Ciclo menor",
      description: "Acelere decisões com urgência legítima e champions.",
    },
    {
      icon: "💬",
      title: "Objeções dominadas",
      description: "Respostas prontas pra avançar sem desgaste.",
    },
  ];

  const perfectFor = [
    "Vendedores que querem aumentar taxa de conversão",
    "Times que precisam organizar CRM e pipeline",
    "Quem faz outbound e não está conseguindo resposta",
    "Gestores que querem playbook e rotina comercial",
    "Startups e PMEs com ciclo longo ou previsibilidade baixa",
  ];

  const learnMore = [
    {
      title: "SPIN Selling na prática",
      desc: "Perguntas de Situação, Problema, Implicação e Necessidade para seu contexto.",
    },
    {
      title: "Cadência de prospecção que funciona",
      desc: "Quantos toques, quais canais, quando insistir e quando parar.",
    },
    {
      title: "CRM sem complicar",
      desc: "Como escolher e estruturar funil, etapas, tarefas e SLAs.",
    },
    {
      title: "Negociação consultiva",
      desc: "Como ancorar valor, mostrar ROI e reduzir desconto.",
    },
    {
      title: "Kit de objeções",
      desc: "Respostas elegantes para preço, timing, indecisão e concorrência.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Assistente de <span className="text-primary">Vendas</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8">
                  Seu parceiro de IA para prospecção, CRM, SPIN Selling, negociação e fechamento — com métodos claros e
                  scripts prontos.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="text-lg">
                    Comece minha análise agora (grátis)
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg">
                    Ver planos Premium
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  Sem promessa milagrosa. Plano claro + execução consistente = evolução.
                </p>
              </div>

              <div className="relative">
                <img
                  src={agenteVendas}
                  alt="Assistente de Vendas"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Como funciona */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">Como funciona</h2>
              <p className="text-muted-foreground mb-6">Simples, rápido e feito para a sua realidade.</p>

              <div className="grid md:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                  <div key={i} className="p-6 rounded-xl bg-card border border-border">
                    <div className="text-3xl mb-3">{s.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium */}
            <div className="mb-16 p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />O que você recebe no Premium
              </h2>

              <div className="grid gap-3">
                {premiumDelivers.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-background border border-border">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefícios */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Benefícios</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-4">{b.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                    <p className="text-muted-foreground">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Para quem */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Perfeito para:</h2>
              <div className="grid gap-3">
                {perfectFor.map((p, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aprenda mais (opcional) */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-2">Aprenda mais (opcional)</h2>
              <p className="text-muted-foreground mb-6">Conteúdo prático para você evoluir com segurança.</p>

              <div className="grid gap-3">
                {learnMore.map((l, i) => (
                  <details key={i} className="group rounded-lg bg-card border border-border p-4">
                    <summary className="cursor-pointer list-none flex items-center justify-between">
                      <span className="font-medium">{l.title}</span>
                      <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <div className="mt-3 text-muted-foreground">{l.desc}</div>
                  </details>
                ))}
              </div>
            </div>

            {/* Segurança e limites */}
            <div className="mb-16 p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Segurança e limites
              </h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                <li>Orientação educativa baseada em boas práticas de vendas.</li>
                <li>Não garante resultados numéricos; depende da execução.</li>
                <li>Não incentiva spam, compra de listas ilícitas ou práticas antiéticas.</li>
                <li>Para casos específicos de compliance/contratos, consulte especialistas.</li>
              </ul>
            </div>

            {/* CTA final */}
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Bora destravar suas vendas?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Diagnóstico rápido + plano prático + scripts prontos.
              </p>
              <Button size="lg" className="text-lg">
                Começar agora (grátis)
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesAssistant;
