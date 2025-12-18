import {
  Check,
  Headset,
  Clock,
  MessagesSquare,
  Shield,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import agenteSuporte from "@/assets/agente_suporte.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SupportAssistant = () => {
  const navigate = useNavigate();

  const handleStartDemo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate(`/login?redirectTo=${encodeURIComponent('/demo/suporte')}`);
    } else {
      navigate('/demo/suporte');
    }
  };

  const steps = [
    {
      icon: "1️⃣",
      title: "Conte seu cenário",
      description:
        "Canal (WhatsApp/chat/e-mail), volume de dúvidas, horários e principais travas do suporte hoje.",
    },
    {
      icon: "2️⃣",
      title: "Receba o plano",
      description:
        "Diagnóstico + prioridades + estrutura de atendimento simples para padronizar e escalar.",
    },
    {
      icon: "3️⃣",
      title: "Execute com fluxos prontos",
      description:
        "FAQs, scripts, triagem e templates que respondem rápido sem perder o toque humano.",
    },
  ];

  const scorePillars = [
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: "Tempo de resposta (25%)",
      desc: "Velocidade, SLA e priorização de urgências.",
    },
    {
      icon: <MessagesSquare className="w-5 h-5 text-primary" />,
      title: "Consistência (20%)",
      desc: "Padrão de respostas, clareza e redução de retrabalho.",
    },
    {
      icon: <ListChecks className="w-5 h-5 text-primary" />,
      title: "Automação & Triagem (20%)",
      desc: "Roteamento por tema (financeiro/técnico/comercial/urgente).",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      title: "Base de conhecimento (20%)",
      desc: "FAQs vivos, objeções mapeadas e respostas atualizadas.",
    },
    {
      icon: <Headset className="w-5 h-5 text-primary" />,
      title: "Tom de voz (15%)",
      desc: "Atendimento humano, alinhado à sua marca.",
    },
  ];

  const premiumDelivers = [
    "Mapeamento completo de FAQs e objeções do suporte",
    "Scripts e árvores de decisão para WhatsApp/Chat",
    "Tom de voz da marca configurado (humano e consistente)",
    "Fluxo de triagem (urgente / financeiro / técnico / comercial)",
    "Templates de respostas por categoria + follow-ups prontos",
    "Checklist semanal de operação do atendimento",
    "Indicadores simples para medir evolução (SLA, CSAT, retrabalho)",
    "Plano de melhoria 7/14/30/90 dias",
  ];

  const benefits = [
    {
      icon: "⚡",
      title: "Respostas em segundos",
      description: "Atenda rápido e reduza filas.",
    },
    {
      icon: "✅",
      title: "Menos retrabalho",
      description: "Padroniza o que funciona e evita ruído.",
    },
    {
      icon: "🧠",
      title: "Atendimento humano",
      description: "Tom certo sem parecer robô.",
    },
    {
      icon: "🗂️",
      title: "FAQs organizadas",
      description: "Base viva que facilita tudo.",
    },
    {
      icon: "📈",
      title: "Satisfação maior",
      description: "Cliente bem atendido volta e indica.",
    },
    {
      icon: "💰",
      title: "Custo menor por atendimento",
      description: "Escala sem aumentar equipe.",
    },
  ];

  const perfectFor = [
    "Negócios com alto volume de dúvidas todo dia",
    "Lojas, e-commerces e infoprodutores",
    "SaaS e empresas com suporte técnico",
    "Clínicas, serviços e atendimento por WhatsApp",
    "Times pequenos que precisam ganhar escala",
    "Quem quer padronizar sem perder humanização",
  ];

  const learnMore = [
    {
      title: "FAQs e objeções que resolvem de verdade",
      content:
        "Como mapear perguntas repetidas, dores e objeções para acelerar atendimento.",
    },
    {
      title: "Triagem inteligente por assunto",
      content:
        "Separação automática do que é urgente, técnico, financeiro ou comercial.",
    },
    {
      title: "Tom de voz da sua marca",
      content:
        "Como manter padrão humano, claro e coerente em todo canal.",
    },
    {
      title: "Templates e follow-ups",
      content:
        "Mensagens prontas para copiar/colar e sequências para não deixar cliente no vácuo.",
    },
    {
      title: "Métricas simples de suporte",
      content:
        "SLA, CSAT, tempo médio e retrabalho — o mínimo que você precisa acompanhar.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Support <span className="text-primary">Assistant</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8">
                  Seu especialista de atendimento 24/7 para WhatsApp, chat e e-mail —
                  respostas rápidas, padronizadas e humanas para escalar o suporte sem perder qualidade.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="text-lg"
                    onClick={handleStartDemo}
                  >
                    Testar demo rápida
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg"
                    onClick={() => navigate('/pricing?focus=growth')}
                  >
                    Ver planos
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  Sem promessas mágicas. Atendimento claro + consistência = clientes mais felizes.
                </p>
              </div>

              <div className="relative">
                <img
                  src={agenteSuporte}
                  alt="Support Assistant"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Como funciona */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">Como funciona</h2>
              <p className="text-muted-foreground mb-6">
                Simples, rápido e feito para a sua operação.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                  <Card key={i} className="border border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-3xl">{s.icon}</span>
                        {s.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      {s.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Score de Atendimento */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">
                Seu Score de Atendimento (0–100)
              </h2>
              <p className="text-muted-foreground mb-6">
                Diagnóstico automático baseado em 5 pilares essenciais para um suporte rápido, humano e escalável.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {scorePillars.map((p, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start p-4 rounded-lg bg-card border border-border"
                  >
                    <div className="mt-0.5">{p.icon}</div>
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-sm text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-lg bg-card border border-border text-sm text-muted-foreground">
                Resultado: diagnóstico + score + prioridades claras para saber exatamente o que ajustar primeiro.
              </div>
            </div>

            {/* Premium */}
            <Card
              id="premium-section"
              className="mb-16 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background scroll-mt-20"
            >
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <Headset className="w-7 h-7 text-primary" />
                  O que você recebe no Premium
                </CardTitle>
                <CardDescription className="text-base">
                  Tudo pronto para você atender e escalar com eficiência.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {premiumDelivers.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-lg bg-background border border-border"
                  >
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Benefícios */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Benefícios
              </h2>
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

            {/* Perfeito para */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Perfeito para:</h2>
              <div className="grid gap-3">
                {perfectFor.map((p, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-lg bg-card border border-border"
                  >
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aprenda mais */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">
                Aprenda mais (opcional)
              </h2>
              <p className="text-muted-foreground mb-6">
                Conteúdo prático para melhorar suporte com segurança.
              </p>

              <Accordion type="single" collapsible className="w-full">
                {learnMore.map((item, i) => (
                  <AccordionItem key={i} value={`learn-${i}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-semibold">{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Segurança e limites */}
            <Card className="mb-16">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Segurança e limites
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2 list-disc pl-5">
                  <li>Orientação baseada em boas práticas de atendimento.</li>
                  <li>Não substitui suporte humano em casos sensíveis/complexos.</li>
                  <li>Não incentiva práticas antiéticas ou enganosas.</li>
                  <li>Respeita privacidade e regras de canal (ex.: WhatsApp).</li>
                  <li>Você aprova e adapta respostas ao seu contexto.</li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA final */}
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mt-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bora destravar seu atendimento?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Diagnóstico rápido + FAQs + scripts + triagem pronta.
              </p>
              <Button
                size="lg"
                className="text-lg"
                onClick={handleStartDemo}
              >
                Testar demo rápida
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportAssistant;
