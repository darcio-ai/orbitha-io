import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Calendar, 
  Bot, 
  TrendingUp, 
  Zap,
  CheckCircle,
  ArrowRight,
  Users,
  BarChart3,
  Clock,
  ShoppingCart
} from "lucide-react";

const Solucoes = () => {
  const handleContact = (message?: string) => {
    const text = message || "Oi! Quero saber mais sobre as soluções de IA da Orbitha";
    window.open(`https://wa.me/5513991497873?text=${encodeURIComponent(text)}`, "_blank");
  };

  const solutions = [
    {
      icon: <MessageSquare className="h-12 w-12" />,
      title: "Automação de Atendimento via WhatsApp",
      description: "IA conversacional 24/7 que entende seus clientes e resolve problemas automaticamente",
      features: [
        "Atendimento 24 horas por dia",
        "Respostas inteligentes e personalizadas", 
        "Integração com seu CRM",
        "Relatórios de conversas",
        "Escalação automática para humanos"
      ],
      benefits: ["95% redução no tempo de resposta", "Aumento de 60% na satisfação"],
      category: "Atendimento"
    },
    {
      icon: <Calendar className="h-12 w-12" />,
      title: "Integrações com Google Agenda e Sistemas",
      description: "Conecte todos os seus sistemas e automatize fluxos de trabalho complexos",
      features: [
        "Agendamento automático de reuniões",
        "Sincronização com planilhas Google",
        "Integração via Zapier e n8n",
        "Automação de relatórios",
        "Notificações inteligentes"
      ],
      benefits: ["70% menos tempo em tarefas manuais", "Zero conflitos de agenda"],
      category: "Integração"
    },
    {
      icon: <Bot className="h-12 w-12" />,
      title: "Agentes de IA Personalizados",
      description: "Assistentes virtuais treinados especificamente para as necessidades da sua empresa",
      features: [
        "Treinamento com dados da empresa",
        "Conhecimento específico do negócio",
        "Múltiplos canais de atendimento",
        "Aprendizado contínuo",
        "Interface personalizada"
      ],
      benefits: ["AI que conhece seu negócio", "Consistência no atendimento"],
      category: "IA Personalizada"
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: "Automatização de Processos de Vendas",
      description: "Otimize seu funil de vendas com automação inteligente e acompanhamento de leads",
      features: [
        "Qualificação automática de leads",
        "Follow-up inteligente",
        "Scoring de oportunidades",
        "Integração com CRM",
        "Relatórios de performance"
      ],
      benefits: ["3x mais conversões", "Pipeline sempre organizado"],
      category: "Vendas"
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: "Relatórios Inteligentes",
      description: "Dashboards automáticos que transformam dados em insights acionáveis para seu negócio",
      features: [
        "Análise de métricas em tempo real",
        "Previsões com IA",
        "Alertas inteligentes",
        "Visualizações personalizadas",
        "Exportação automatizada"
      ],
      benefits: ["Decisões baseadas em dados", "Visibilidade total do negócio"],
      category: "Analytics"
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: "Automação de Processos",
      description: "Conecte diferentes ferramentas e crie fluxos automatizados que economizam horas do seu dia",
      features: [
        "Integrações múltiplas",
        "Workflows customizados",
        "Gatilhos inteligentes",
        "Monitoramento em tempo real",
        "Logs detalhados"
      ],
      benefits: ["80% menos trabalho manual", "Processos sem erros"],
      category: "Automação"
    }
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, number: "100+", label: "Empresas atendidas" },
    { icon: <BarChart3 className="h-8 w-8" />, number: "95%", label: "Redução no tempo de resposta" },
    { icon: <Clock className="h-8 w-8" />, number: "24/7", label: "Disponibilidade" },
    { icon: <Zap className="h-8 w-8" />, number: "3x", label: "Aumento na produtividade" }
  ];

  const steps = [
    {
      number: "1",
      title: "Consulta Inicial",
      description: "Conversamos sobre seu negócio, processos atuais e identificamos oportunidades de automação."
    },
    {
      number: "2",
      title: "Desenvolvimento",
      description: "Criamos seu agente de IA personalizado e integramos com suas ferramentas existentes."
    },
    {
      number: "3",
      title: "Treinamento & Deploy",
      description: "Treinamos sua equipe e colocamos o agente em produção com suporte total."
    },
    {
      number: "4",
      title: "Otimização Contínua",
      description: "Monitoramos performance e otimizamos continuamente para maximizar resultados."
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Bot className="w-5 h-5" />
              <span className="text-sm font-medium">Soluções B2B em IA</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Soluções que <span className="bg-gradient-primary bg-clip-text text-transparent">transformam</span> seu negócio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Automatize processos, integre ferramentas e escale seu negócio com agentes de inteligência artificial 
              desenvolvidos sob medida para suas necessidades.
            </p>
            <Button size="lg" onClick={() => handleContact()} className="text-lg px-8">
              Falar com Especialista
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-foreground">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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

      {/* Solutions Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nossas <span className="text-primary">Soluções</span>
          </h2>
          <div className="space-y-16">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-card border-border shadow-card overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CardHeader className="space-y-6 p-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <div className="text-primary-foreground">
                          {solution.icon}
                        </div>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {solution.category}
                        </Badge>
                        <CardTitle className="text-2xl">{solution.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      {solution.description}
                    </p>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Benefícios:</h4>
                      <div className="space-y-2">
                        {solution.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-primary font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8 bg-secondary/30">
                    <h4 className="font-semibold text-lg mb-6">Funcionalidades:</h4>
                    <div className="space-y-4">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-8" onClick={() => handleContact(`Oi! Quero saber mais sobre: ${solution.title}`)}>
                      Quero essa solução
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como <span className="text-primary">Funciona</span>
          </h2>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Pronto para automatizar seu negócio?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Agende uma conversa gratuita e descubra como nossos agentes de IA podem transformar sua operação.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => handleContact("Oi! Quero agendar uma consulta gratuita sobre automação com IA")}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Agendar Consulta Gratuita
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solucoes;
