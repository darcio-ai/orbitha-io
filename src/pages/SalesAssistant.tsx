import { Check, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import agenteVendas from "@/assets/agente_vendas.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BetaActivationButton } from "@/components/BetaActivationButton";

const SalesAssistant = () => {
  const navigate = useNavigate();

  const handleStartDemo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate(`/login?redirectTo=${encodeURIComponent('/demo/vendas')}`);
    } else {
      navigate('/demo/vendas');
    }
  };
  const steps = [
    {
      icon: "1️⃣",
      title: "Conte seu cenário",
      description: "Segmento, ICP (perfil de cliente ideal), ticket, ciclo, canal e trava atual.",
    },
    {
      icon: "2️⃣",
      title: "Receba o plano",
      description: "Diagnóstico + prioridades.",
    },
    {
      icon: "3️⃣",
      title: "Execute com scripts",
      description: "Cadência, SPIN, objeções, follow-ups.",
    },
  ];

  const premiumDelivers = [
    "Diagnóstico comercial completo",
    "Playbook por etapa do funil",
    "Roteiro SPIN Selling adaptado",
    "Cadências outbound/inbound prontas",
    "Templates (email, LinkedIn, WhatsApp, call)",
    "Kit de objeções",
    "Sugestão/setup de CRM",
    "Plano 7/14/30 dias",
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
    {
      icon: "📊",
      title: "Previsibilidade comercial",
      description: "Pipeline mais claro e metas mais realistas.",
    },
  ];

  const perfectFor = [
    "Vendedores que querem aumentar conversão",
    "Times que precisam organizar CRM e pipeline",
    "Quem faz outbound sem resposta",
    "Gestores que querem playbook comercial",
    "Startups/PMEs com ciclo longo",
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
              <div className="px-4 md:px-6 lg:px-8">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Assistente de <span className="text-primary">Vendas</span>
                  </h1>

                  <p className="text-xl text-muted-foreground mb-8">
                    IA para prospecção, SPIN Selling, CRM e objeções — com plano claro e scripts prontos.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
                    <Button size="lg" className="text-lg" onClick={handleStartDemo}>
                      Testar demo rápida
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg sm:text-lg text-sm" onClick={() => navigate('/pricing?focus=growth')}>
                      Ver planos
                    </Button>
                    <BetaActivationButton
                      assistantId="vendas"
                      assistantName="Vendas"
                      planType="growth"
                      couponCode="BETANATAL-VEN"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    Sem promessa milagrosa. Plano claro + scripts prontos + execução consistente = evolução.
                  </p>
                </div>
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
              <h2 className="text-3xl font-bold mb-6">Como funciona</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                  <div key={i} className="p-6 rounded-xl bg-card border border-border flex flex-col">
                    <div className="text-3xl mb-3">{s.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground flex-grow">{s.description}</p>
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
              <h2 className="text-2xl font-bold mb-6">Aprenda mais (opcional)</h2>

              <Accordion type="single" collapsible className="w-full space-y-3">
                {learnMore.map((l, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-4 bg-card">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-medium text-left">{l.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {l.desc}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Segurança e limites */}
            <div className="mb-16 p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Segurança e limites
              </h2>
              <div className="grid gap-3">
                <div className="flex gap-4 p-4 rounded-lg bg-background border border-border">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">Orientação educativa baseada em boas práticas</p>
                </div>
                <div className="flex gap-4 p-4 rounded-lg bg-background border border-border">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">Não garante resultados numéricos</p>
                </div>
                <div className="flex gap-4 p-4 rounded-lg bg-background border border-border">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">Não incentiva spam/compra de listas/práticas antiéticas</p>
                </div>
                <div className="flex gap-4 p-4 rounded-lg bg-background border border-border">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">Para compliance jurídico/contratos, consultar especialista</p>
                </div>
              </div>
            </div>

            {/* CTA final */}
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Bora destravar suas vendas?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Diagnóstico rápido + plano prático + scripts prontos.
              </p>
              <Button size="lg" className="text-lg" onClick={handleStartDemo}>
                Testar demo rápida
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesAssistant;
