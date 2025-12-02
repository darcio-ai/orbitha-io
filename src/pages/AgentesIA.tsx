import { Bot, Zap, Calendar, ShoppingCart, MessageSquare, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AgentesIA = () => {
  const agentes = [
    {
      icon: MessageSquare,
      title: "Atendimento WhatsApp Inteligente",
      description: "Agente de IA que atende seus clientes 24/7 no WhatsApp com respostas personalizadas e contextualizadas.",
      features: ["Respostas automáticas", "Contexto de conversas", "Integração com CRM"]
    },
    {
      icon: Calendar,
      title: "Agendamento Integrado",
      description: "Sincronize sua agenda automaticamente e deixe a IA gerenciar seus compromissos de forma inteligente.",
      features: ["Sincronização Google Calendar", "Lembretes automáticos", "Reagendamento inteligente"]
    },
    {
      icon: ShoppingCart,
      title: "Vendas Automatizadas",
      description: "Automatize seu funil de vendas com IA que qualifica leads e fecha negócios enquanto você dorme.",
      features: ["Qualificação de leads", "Follow-up automático", "Pipeline inteligente"]
    },
    {
      icon: BarChart3,
      title: "Relatórios Inteligentes",
      description: "Dashboards automáticos que transformam dados em insights acionáveis para seu negócio.",
      features: ["Análise de métricas", "Previsões com IA", "Alertas inteligentes"]
    },
    {
      icon: Bot,
      title: "Assistente Personalizado",
      description: "Crie seu próprio agente de IA customizado para tarefas específicas do seu negócio.",
      features: ["100% personalizado", "Integração com APIs", "Treinamento específico"]
    },
    {
      icon: Zap,
      title: "Automação de Processos",
      description: "Conecte diferentes ferramentas e crie fluxos automatizados que economizam horas do seu dia.",
      features: ["Integrações múltiplas", "Workflows customizados", "Gatilhos inteligentes"]
    }
  ];

  const handleContact = () => {
    window.open("https://wa.me/5513991497873?text=Olá! Quero saber mais sobre os Agentes de IA da Orbitha", "_blank");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Bot className="w-5 h-5" />
              <span className="text-sm font-medium">Automações com IA</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Agentes de <span className="text-primary">IA Personalizados</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Automatize processos, integre ferramentas e escale seu negócio com agentes de inteligência artificial 
              desenvolvidos sob medida para suas necessidades.
            </p>

            <Button size="lg" onClick={handleContact} className="text-lg px-8">
              Falar com Especialista
            </Button>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">🚀 Implementação Rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Agentes prontos em dias, não meses. Comece a economizar tempo imediatamente.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">🎯 100% Customizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cada agente é desenvolvido especificamente para o seu negócio e processos.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">💰 ROI Garantido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Economize horas de trabalho manual e reduza custos operacionais drasticamente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agentes Grid */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nossos <span className="text-primary">Agentes de IA</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {agentes.map((agente, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <agente.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{agente.title}</CardTitle>
                  <CardDescription className="text-base">{agente.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {agente.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={handleContact} className="text-lg px-8">
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como <span className="text-primary">Funciona</span>
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Consulta Inicial</h3>
                <p className="text-muted-foreground">
                  Conversamos sobre seu negócio, processos atuais e identificamos oportunidades de automação.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Criamos seu agente de IA personalizado e integramos com suas ferramentas existentes.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Treinamento & Deploy</h3>
                <p className="text-muted-foreground">
                  Treinamos sua equipe e colocamos o agente em produção com suporte total.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Otimização Contínua</h3>
                <p className="text-muted-foreground">
                  Monitoramos performance e otimizamos continuamente para maximizar resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Automatizar seu Negócio?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Agende uma conversa gratuita e descubra como nossos agentes de IA podem transformar sua operação.
          </p>
          <Button size="lg" onClick={handleContact} className="text-lg px-8">
            Agendar Consulta Gratuita
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AgentesIA;
