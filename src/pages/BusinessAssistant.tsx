import { Check, LineChart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import agenteBusiness from "@/assets/agente_business.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const BusinessAssistant = () => {
  const navigate = useNavigate();

  const handleStartDemo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate(`/login?redirectTo=${encodeURIComponent('/demo/business')}`);
    } else {
      navigate('/demo/business');
    }
  };
  const steps = [
    {
      icon: "1️⃣",
      title: "Conte seu cenário",
      description:
        "MEI ou PJ, faturamento, custos, rotina e onde seu negócio trava hoje."
    },
    {
      icon: "2️⃣",
      title: "Receba o plano",
      description:
        "Diagnóstico simples + prioridades claras + plano 7/30/90 dias."
    },
    {
      icon: "3️⃣",
      title: "Execute com templates",
      description:
        "Fluxo de caixa, precificação, checklist MEI/PJ e rotinas semanais."
    }
  ];

  const premiumDelivers = [
    "Diagnóstico financeiro PJ/MEI completo",
    "Separação PF x PJ com pró-labore sugerido",
    "Fluxo de caixa mensal com reserva do negócio",
    "Precificação com margem e custo real (markup/hora)",
    "Checklist de obrigações MEI/PJ (educativo)",
    "Rotina de gestão semanal (metas e indicadores simples)",
    "Plano de organização operacional e prioridades",
    "Plano 7/30/90 dias para estabilizar e crescer"
  ];

  const benefits = [
    {
      icon: "💼",
      title: "Negócio organizado",
      description: "Rotina simples pra não se perder na operação."
    },
    {
      icon: "💸",
      title: "Dinheiro no controle",
      description: "Fluxo de caixa claro e previsível."
    },
    {
      icon: "🎯",
      title: "Preço certo",
      description: "Precificação com margem real, sem achismo."
    },
    {
      icon: "🧾",
      title: "Obrigações em dia",
      description: "Checklists MEI/PJ pra não cair em multas."
    },
    {
      icon: "📈",
      title: "Crescimento seguro",
      description: "Plano prático pra estabilizar e escalar."
    },
    {
      icon: "🧠",
      title: "Decisão com clareza",
      description: "Menos ansiedade e mais direção."
    }
  ];

  const perfectFor = [
    "MEIs e autônomos que estão começando",
    "Pequenos negócios sem controle de caixa",
    "Quem mistura PF e PJ e vive no aperto",
    "Empreendedores que não sabem precificar",
    "Negócios com sazonalidade e falta de reserva",
    "Quem quer crescer com organização"
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Assistente <span className="text-primary">PJ/MEI</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8">
                  Organize seu negócio com IA: fluxo de caixa, PF x PJ,
                  precificação, rotinas e checklists — com plano claro e execução simples.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <Button size="lg" className="text-lg w-full sm:w-auto" onClick={handleStartDemo}>
                    Testar demo rápida
                  </Button>
                  <Button size="lg" variant="outline" className="sm:text-lg text-sm w-full sm:w-auto" onClick={() => navigate('/pricing?focus=suite')}>
                    Ver planos
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  Sem promessa milagrosa. Rotina clara + consistência = resultado.
                </p>
              </div>

              <div className="relative">
                <img
                  src={agenteBusiness}
                  alt="Assistente PJ/MEI"
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
                  <div key={i} className="p-6 rounded-xl bg-card border border-border h-full">
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
                <LineChart className="w-6 h-6 text-primary" />
                O que você recebe no Premium
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
                  <div key={i} className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
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
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Segurança e limites */}
            <div className="mb-16 p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Segurança e limites
              </h2>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">Orientação educativa baseada em boas práticas de gestão.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">Não substitui contador, advogado ou consultor fiscal.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">Não oferece instruções para fraude, sonegação ou práticas ilegais.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">Para casos contábeis/jurídicos específicos, consulte um profissional.</p>
                </div>
              </div>
            </div>

            {/* Aprenda mais (opcional) */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-2">Aprenda mais (opcional)</h2>
              <p className="text-muted-foreground mb-6">
                Conteúdo prático para você crescer com segurança.
              </p>

              <Accordion type="single" collapsible className="w-full space-y-3">
                <AccordionItem value="item-1" className="rounded-lg bg-card border border-border px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    Separação PF x PJ na prática
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Como definir pró-labore, contas separadas e reserva do negócio.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="rounded-lg bg-card border border-border px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    Fluxo de caixa simples
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Modelo fácil de entradas/saídas + caixa mínimo recomendado.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="rounded-lg bg-card border border-border px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    Precificação com margem real
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Como calcular custo, hora trabalhada e markup.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="rounded-lg bg-card border border-border px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    Checklist MEI/PJ
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Rotina educativa para manter obrigações em ordem.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="rounded-lg bg-card border border-border px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    Plano 7/30/90 dias
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Ações priorizadas para estabilizar e crescer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* CTA final */}
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bora organizar seu negócio?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Diagnóstico rápido + plano prático + templates prontos.
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

export default BusinessAssistant;
