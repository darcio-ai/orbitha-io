import { Check, MapPin, Calendar, Sparkles, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import agenteViagens from "@/assets/agente_viagens.png";
import { supabase } from "@/integrations/supabase/client";
import { BetaActivationButton } from "@/components/BetaActivationButton";

const TravelAssistant = () => {
  const navigate = useNavigate();

  const handleStartDemo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate(`/login?redirectTo=${encodeURIComponent('/demo/viagens')}`);
    } else {
      navigate('/demo/viagens');
    }
  };
  const howItWorks = [
    {
      icon: MapPin,
      title: "Conte sua ideia",
      description: "Destino, datas, estilo e orçamento"
    },
    {
      icon: Calendar,
      title: "Receba seu roteiro",
      description: "Dia a dia com prioridades e deslocamentos"
    },
    {
      icon: Sparkles,
      title: "Ajuste até ficar perfeito",
      description: "Alternativas, plano B e checklist"
    }
  ];

  const premiumFeatures = [
    "Roteiro dia a dia (essenciais + extras)",
    "Orçamento por categoria (faixas realistas)",
    "Versões econômica/confortável/premium",
    "Checklist de docs/seguro/preparação",
    "Ajustes conforme mudanças",
    "Memória conversacional"
  ];

  const benefits = [
    {
      icon: "🌍",
      title: "Menos pesquisa, mais viagem",
      description: "O que levaria dias, ele faz em minutos"
    },
    {
      icon: "💰",
      title: "Orçamento com pé no chão",
      description: "Gaste com o que importa, economize no resto"
    },
    {
      icon: "📍",
      title: "Roteiro do seu jeito",
      description: "Além dos pontos turísticos óbvios"
    },
    {
      icon: "⏰",
      title: "Tempo bem aproveitado",
      description: "Roteiros otimizados para não perder tempo"
    }
  ];

  const perfectFor = [
    "Quem tem pouco tempo para pesquisar",
    "Quem quer aproveitar cada minuto do destino",
    "Quem viaja pela primeira vez para um lugar",
    "Quem quer fugir do óbvio e descobrir lugares únicos"
  ];

  const travelFormats = [
    "Viagens em família (com crianças, pais ou avós)",
    "Viagens românticas (lua de mel, aniversário, pedido de casamento)",
    "Viagens solo (segurança, socialização, roteiros flexíveis)",
    "Mochilão (econômico, autêntico, off the beaten path)",
    "Viagens corporativas (eventos, networking, otimização de tempo)",
    "Road trips (roteiros de carro, paradas estratégicas)"
  ];

  const whatCanIDo = [
    "Roteiros Personalizados - Itinerário dia a dia, com horários, deslocamentos e tempo em cada atração",
    "Orçamento Realista - Quanto você vai gastar com hospedagem, alimentação, transporte e passeios",
    "Dicas Locais - Aqueles lugares que só quem conhece o destino sabe (restaurantes escondidos, mirantes secretos, horários ideais)",
    "Planejamento Logístico - Como ir do aeroporto ao hotel, qual transporte usar, como se locomover pela cidade",
    "Documentação Necessária - Visto, vacinas, seguro viagem, o que não pode faltar",
    "Melhores Épocas - Quando ir para evitar chuvas, multidões ou pegar eventos especiais",
    "Opções de Hospedagem - Hotéis, hostels, Airbnb, com prós e contras de cada área da cidade",
    "Roteiros Alternativos - Plano B para dias de chuva ou se algo não sair como esperado"
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Assistente de <span className="text-primary">Viagem</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Bora tirar sua viagem do papel? Eu monto roteiro, organizo custos e simplifico a logística pra você só curtir.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                  <Button size="lg" className="text-lg" onClick={handleStartDemo}>
                    Testar demo rápida
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate('/pricing?focus=suite')}>
                    Ver planos
                  </Button>
                  <BetaActivationButton
                    assistantId="viagens"
                    assistantName="Viagens"
                    planType="life_balance"
                    couponCode="BETANATAL-VIA"
                  />
                </div>
              </div>
              <div className="relative">
                <img
                  src={agenteViagens}
                  alt="Travel Assistant"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Como funciona */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Como funciona</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {howItWorks.map((step, index) => (
                  <Card key={index} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          <step.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-muted-foreground">{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <CardDescription>{step.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* O que você recebe no Premium */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">O que você recebe no Premium</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Benefícios</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Perfect For */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Perfeito para:</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {perfectFor.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Segurança e limites */}
            <div className="mb-16 p-6 rounded-xl bg-muted/50 border border-border">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-3">Segurança e limites</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Conteúdo informativo, não faz reservas</li>
                    <li>• Preços e regras variam conforme época e operadoras</li>
                    <li>• Confirme visto, vacinas, clima e segurança em fontes oficiais</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA final */}
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sua próxima aventura começa aqui ✈️
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Me diga destino e período. Eu monto um roteiro do seu jeito.
              </p>
              <Button size="lg" className="text-lg" onClick={handleStartDemo}>
                Testar demo rápida
              </Button>
            </div>

            {/* Aprenda mais (opcional) */}
            <div className="border-t border-border pt-16">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold">Aprenda mais (opcional)</h2>
              </div>
              <p className="text-muted-foreground mb-8">
                Conteúdo educativo para você entender melhor e planejar com mais segurança.
              </p>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="formats" className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">Formatos de viagem que consigo planejar</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                    {travelFormats.map((format, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <p>{format}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="what-i-do" className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">O que eu posso montar pra você</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                    {whatCanIDo.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p>{item}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="destinations" className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">Informações atualizadas (quando necessário)</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                    <p>
                      <strong>Destinos cobertos:</strong> Nacionais (todas as regiões do Brasil) e internacionais 
                      (Europa, Américas, Ásia, África, Oceania). Se existe, eu conheço ou pesquiso profundamente para você.
                    </p>
                    <p className="mt-4">
                      <strong>Dicas importantes:</strong> Ele não apenas lista atrações. Ele conta a história por trás 
                      de cada lugar, sugere a melhor sequência para evitar filas, indica restaurantes com melhor 
                      custo-benefício e até ajusta o roteiro se você cansar no meio do dia.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="disclaimer" className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">Aviso importante</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-semibold mb-2">Conteúdo educativo</p>
                      <p>
                        Este assistente fornece informações e sugestões educativas para planejamento de viagens. 
                        Não realizamos reservas ou vendas. Preços, disponibilidade e regras variam conforme época, 
                        operadoras e destinos.
                      </p>
                      <p className="mt-3">
                        <strong>Sempre confirme:</strong> Requisitos de visto, vacinas obrigatórias, condições 
                        climáticas e orientações de segurança em fontes oficiais (consulados, embaixadas, órgãos 
                        de saúde e turismo).
                      </p>
                    </div>
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

export default TravelAssistant;
