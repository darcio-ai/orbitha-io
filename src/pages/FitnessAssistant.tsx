import { Check, ShieldAlert, Dumbbell, Apple, HeartPulse, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import agenteFitness from "@/assets/agente_fitness.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BetaActivationButton } from "@/components/BetaActivationButton";

const FitnessAssistant = () => {
  const navigate = useNavigate();

  const handleStartDemo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate(`/login?redirectTo=${encodeURIComponent('/demo/fitness')}`);
    } else {
      navigate('/demo/fitness');
    }
  };

  const howItWorks = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: "1) Conte sua situação",
      desc: "Objetivo, nível, rotina, equipamentos e possíveis limitações.",
    },
    {
      icon: <Dumbbell className="w-6 h-6 text-primary" />,
      title: "2) Receba seu plano",
      desc: "Treino semanal personalizado com progressão inteligente.",
    },
    {
      icon: <Apple className="w-6 h-6 text-primary" />,
      title: "3) Ajuste e evolua",
      desc: "Nutrição educativa, hábitos e revisões ao longo das semanas.",
    },
  ];

  const premiumDelivers = [
    "Treino personalizado por objetivo e nível (academia, casa ou peso corporal)",
    "Progressão inteligente para evoluir sem estagnar",
    "Nutrição educativa básica (TMB/TDEE, macros e déficit/superávit sustentável)",
    "Recuperação e hábitos (sono, passos, mobilidade, dias de descanso)",
    "Memória conversacional: não repete perguntas e adapta ao seu contexto",
  ];

  const perfectFor = [
    "Iniciantes que querem um caminho claro para começar",
    "Quem já treina, mas estagnou e precisa de direção",
    "Pessoas com pouco tempo e rotina corrida",
    "Quem treina em casa ou sem personal",
    "Quem quer melhorar saúde, estética ou performance com consistência",
  ];

  const benefits = [
    {
      icon: "🎯",
      title: "Plano possível de seguir",
      description: "Nada de radicalismo: metas realistas para sua rotina.",
    },
    {
      icon: "💪",
      title: "Treinos eficientes",
      description: "Sessões objetivas com foco no que dá resultado.",
    },
    {
      icon: "🍽️",
      title: "Nutrição educativa",
      description: "Entenda calorias, macros e estratégias simples.",
    },
    {
      icon: "🧠",
      title: "Evolução com segurança",
      description: "Ajustes conforme seu nível e limitações.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* HERO */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Fitness <span className="text-primary">Assistant</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Seu coach de IA para treinos personalizados, nutrição educativa e hábitos saudáveis — do jeito que
                  cabe na sua vida.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                  <Button size="lg" className="text-lg" onClick={handleStartDemo}>
                    Testar demo rápida
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg" onClick={() => navigate("/pricing?focus=suite")}>
                    Ver planos
                  </Button>
                  <BetaActivationButton
                    assistantId="fitness"
                    assistantName="Fitness"
                    planType="life_balance"
                    couponCode="BETANATAL-FIT"
                  />
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Sem promessa milagrosa. Um plano claro + consistência = evolução.
                </p>
              </div>

              <div className="relative">
                <img src={agenteFitness} alt="Fitness Assistant" className="w-full h-auto object-contain rounded-2xl" />
              </div>
            </div>

            {/* COMO FUNCIONA */}
            <div className="mb-14">
              <h2 className="text-3xl font-bold mb-2">Como funciona</h2>
              <p className="text-muted-foreground mb-8">Simples, rápido e feito para sua realidade.</p>

              <div className="grid md:grid-cols-3 gap-6">
                {howItWorks.map((step, i) => (
                  <Card key={i} className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">{step.icon}</div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base mt-2">{step.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* O QUE O PREMIUM ENTREGA */}
            <Card className="mb-14 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Activity className="w-6 h-6 text-primary" />O que você recebe no Premium
                </CardTitle>
                <CardDescription className="text-base">
                  Conteúdo prático e educativo, com ajustes contínuos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {premiumDelivers.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start p-3 rounded-lg bg-background/60 border border-border"
                  >
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* BENEFÍCIOS */}
            <div className="mb-14">
              <h2 className="text-3xl font-bold mb-8 text-center">Benefícios</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-3">{b.icon}</div>
                    <h3 className="text-lg font-bold mb-1">{b.title}</h3>
                    <p className="text-muted-foreground text-sm">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PERFEITO PARA */}
            <div className="mb-14">
              <h2 className="text-3xl font-bold mb-6">Perfeito para:</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {perfectFor.map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPLIANCE CURTO */}
            <Card className="mb-14 border-2 border-blue-500/30 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Segurança e limites
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>
                  Este assistente oferece orientação <strong>educativa</strong> sobre treino, nutrição básica e hábitos.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Não substitui médico, nutricionista, personal trainer ou fisioterapeuta.</li>
                  <li>Não prescreve dietas clínicas/restritivas nem trata doenças.</li>
                  <li>
                    Em caso de dor forte, condição clínica, gravidez ou lesão grave, procure um profissional antes de
                    iniciar ou alterar treinos.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA FINAL */}
            <div className="text-center p-10 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Comece hoje com um plano feito para você</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Diagnóstico rápido + treino personalizado + hábitos que sustentam resultados.
              </p>
              <Button size="lg" className="text-lg" onClick={handleStartDemo}>
                Testar demo rápida
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Conteúdo educativo • Ajustável à sua rotina • Sem promessas irreais
              </p>
            </div>

            {/* APRENDA MAIS (OPCIONAL) */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-1">📚 Aprenda mais (opcional)</h3>
              <p className="text-muted-foreground mb-6">
                Conteúdo educativo para você entender melhor e evoluir com mais segurança.
              </p>

              <Accordion type="single" collapsible className="w-full space-y-3">
                <AccordionItem value="tendencias" className="border rounded-lg px-2 bg-card">
                  <AccordionTrigger className="text-left font-semibold">
                    Tendências modernas que o assistente considera
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Treinos curtos e eficientes (HIIT), musculação bem estruturada, calistenia/peso corporal, funcional,
                    longevidade ativa, integração com saúde mental e uso inteligente de dados (quando você compartilha).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="modalidades" className="border rounded-lg px-2 bg-card">
                  <AccordionTrigger className="text-left font-semibold">Treinos por modalidade</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    O assistente pode montar rotinas específicas para musculação, funcional, corrida/ciclismo,
                    yoga/mobilidade, natação e treinos híbridos — adaptando ao seu nível.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="nutricao" className="border rounded-lg px-2 bg-card">
                  <AccordionTrigger className="text-left font-semibold">
                    Nutrição educativa (sem radicalismo)
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      Você recebe orientações simples sobre calorias, macros e estratégia alimentar para seu objetivo.
                      Nada de dietas extremas.
                    </p>
                    <p className="text-sm italic">Conteúdo educativo. Para casos clínicos, procure nutricionista.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="apps" className="border rounded-lg px-2 bg-card">
                  <AccordionTrigger className="text-left font-semibold">Apps e wearables (opcional)</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Se você já usa apps ou relógios inteligentes, pode compartilhar seus dados para personalização
                    melhor. Exemplos comuns: apps de calorias, corrida/ciclismo, treinos em casa e smartwatches. O
                    assistente adapta ao que você tiver.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mitos" className="border rounded-lg px-2 bg-card">
                  <AccordionTrigger className="text-left font-semibold">Dúvidas comuns e mitos</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    O assistente esclarece execução correta, progressão de carga, frequência ideal, descanso, e
                    desmistifica “atalhos” que não se sustentam.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="disclaimer" className="border rounded-lg px-2 bg-card">
                  <AccordionTrigger className="text-left font-semibold">Aviso importante</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    Tudo aqui é educativo. Resultados dependem de consistência, sono, alimentação, histórico de treino e
                    saúde individual. Em situações médicas específicas, consulte profissionais.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FitnessAssistant;
