import {
  Check,
  Megaphone,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import agenteMarketing from "@/assets/agente_marketing.png";
import { useNavigate } from "react-router-dom";

const MarketingAssistant = () => {
  const navigate = useNavigate();

  const scrollToPremium = () => {
    const premiumSection = document.getElementById('premium-section');
    premiumSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const steps = [
    {
      icon: "1️⃣",
      title: "Conte seu cenário",
      description:
        "O que você vende, pra quem vende, canais, orçamento e onde o marketing trava hoje.",
    },
    {
      icon: "2️⃣",
      title: "Receba o plano",
      description:
        "Diagnóstico claro + prioridades certas + plano 7/14/30/90 dias.",
    },
    {
      icon: "3️⃣",
      title: "Execute com materiais prontos",
      description:
        "Calendário, anúncios, copies, roteiros e páginas sob medida.",
    },
  ];

  const premiumDelivers = [
    "Diagnóstico completo de marketing (oferta, ICP, canais, funil, métricas)",
    "Plano prático 7/14/30/90 dias com metas realistas",
    "Calendário de conteúdo (semanal/mensal) com temas, ganchos e CTAs",
    "Copies para anúncios (Meta/Google/LinkedIn) com variações",
    "Roteiros para Reels/TikTok/YouTube (30–90s) alinhados ao seu ICP",
    "Estrutura de landing pages que convertem (headline → prova → oferta → CTA)",
    "Sequências de e-mail/WhatsApp para nutrição e venda",
    "Testes A/B e hipóteses de crescimento fáceis de medir",
  ];

  const benefits = [
    {
      icon: "🎯",
      title: "Mais leads qualificados",
      description: "Atrai as pessoas certas com mensagem certa.",
    },
    {
      icon: "📈",
      title: "Conversão maior",
      description: "Funil simples e claro pra vender mais.",
    },
    {
      icon: "🗓️",
      title: "Rotina pronta",
      description: "Conteúdo organizado sem depender de inspiração.",
    },
    {
      icon: "✍️",
      title: "Copy sob medida",
      description: "Textos prontos por canal e objetivo.",
    },
    {
      icon: "💰",
      title: "Melhor uso do orçamento",
      description: "Prioriza o que dá ROI de verdade.",
    },
    {
      icon: "⚡",
      title: "Velocidade de execução",
      description: "Do plano à publicação em minutos.",
    },
  ];

  const perfectFor = [
    "MEIs e pequenos negócios sem time de marketing",
    "Quem posta muito e vende pouco",
    "Quem quer começar tráfego pago com segurança",
    "Negócios que precisam gerar leads toda semana",
    "Times pequenos (ou solo) sem estrutura de funil",
    "Quem quer crescer com consistência, não com sorte",
  ];

  const learnMore = [
    {
      title: "ICP e posicionamento que vendem",
      content:
        "Como definir público ideal, dores reais e uma proposta de valor simples e clara.",
    },
    {
      title: "Calendário de conteúdo inteligente",
      content:
        "Estrutura semanal/mensal com objetivos claros por post (atrair, nutrir, converter).",
    },
    {
      title: "Anúncios com foco em ROI",
      content:
        "Como criar criativos, copys e testes A/B que melhoram performance sem jogar dinheiro fora.",
    },
    {
      title: "Funil simples (Topo → Meio → Fundo)",
      content:
        "Sequência prática para transformar atenção em venda com mensagens certas em cada etapa.",
    },
    {
      title: "Métricas que importam",
      content:
        "O básico que move o negócio: leads, conversão, CAC, ticket, LTV e taxa de retorno.",
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
                  Marketing <span className="text-primary">Assistant</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8">
                  Seu estrategista 24/7 para ICP, funil simples, conteúdo e anúncios prontos que atraem e convertem clientes com consistência.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="text-lg"
                    onClick={() => navigate("/pricing")}
                  >
                    Começar minha análise agora (grátis)
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg"
                    onClick={scrollToPremium}
                  >
                    Ver Premium
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  Sem promessa milagrosa. Rotina clara + consistência = resultado.
                </p>
              </div>

              <div className="relative">
                <img
                  src={agenteMarketing}
                  alt="Marketing Assistant"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Como funciona */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">Como funciona</h2>
              <p className="text-muted-foreground mb-6">
                Simples, rápido e feito para a sua realidade.
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

            {/* O que você recebe no Premium */}
            <Card id="premium-section" className="mb-16 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <Megaphone className="w-7 h-7 text-primary" />
                  O que você recebe no Premium
                </CardTitle>
                <CardDescription className="text-base">
                  Tudo pronto para você executar, medir e ajustar.
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

            {/* Aprenda mais (opcional) */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">
                Aprenda mais (opcional)
              </h2>
              <p className="text-muted-foreground mb-6">
                Conteúdo prático para acelerar seus resultados com segurança.
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
                  <li>Orientação baseada em boas práticas de marketing.</li>
                  <li>Não garante resultados numéricos específicos.</li>
                  <li>Não incentiva spam, compra de listas ou práticas antiéticas.</li>
                  <li>Respeita regras das plataformas e privacidade.</li>
                  <li>Você decide o que executar e ajusta à sua realidade.</li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA final */}
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mt-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bora destravar seu marketing?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Diagnóstico rápido + plano prático + materiais prontos.
              </p>
              <Button
                size="lg"
                className="text-lg"
                onClick={() => navigate("/pricing")}
              >
                Começar minha análise agora (grátis)
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketingAssistant;
