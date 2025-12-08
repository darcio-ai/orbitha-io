import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Workflow,
  ExternalLink
} from "lucide-react";
import { automationFlows, AutomationFlow } from "@/config/automationFlows";

const Solucoes = () => {
  const [selectedFlow, setSelectedFlow] = useState<AutomationFlow | null>(null);

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
    { icon: <Clock className="h-8 w-8" />, number: "500+", label: "Horas economizadas/mês" },
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Vendas": "bg-green-500/10 text-green-600 border-green-500/20",
      "Marketing": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      "Atendimento": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Analytics": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "Customer Success": "bg-orange-500/10 text-orange-600 border-orange-500/20"
    };
    return colors[category] || "bg-primary/10 text-primary border-primary/20";
  };

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

      {/* Automation Flows Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Workflow className="w-5 h-5" />
              <span className="text-sm font-medium">Fluxos de Automação Reais</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Automações que <span className="text-primary">funcionam</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça alguns dos fluxos de automação que implementamos para nossos clientes. 
              Clique para ver os detalhes de cada um.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {automationFlows.map((flow) => (
              <Card 
                key={flow.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border overflow-hidden group"
                onClick={() => setSelectedFlow(flow)}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={flow.image} 
                    alt={flow.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.querySelector('.placeholder-icon')?.classList.remove('hidden');
                    }}
                  />
                  <div className="placeholder-icon hidden absolute inset-0 flex items-center justify-center">
                    <Workflow className="h-16 w-16 text-primary/40" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardHeader className="pb-2">
                  <Badge variant="outline" className={`w-fit mb-2 ${getCategoryColor(flow.category)}`}>
                    {flow.category}
                  </Badge>
                  <CardTitle className="text-lg line-clamp-2">{flow.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {flow.shortDescription}
                  </CardDescription>
                  <div className="flex items-center gap-1 mt-3 text-sm text-primary">
                    <span>Ver detalhes</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Detail Modal */}
      <Dialog open={!!selectedFlow} onOpenChange={() => setSelectedFlow(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedFlow && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className={getCategoryColor(selectedFlow.category)}>
                    {selectedFlow.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{selectedFlow.estimatedTime}</span>
                </div>
                <DialogTitle className="text-2xl">{selectedFlow.name}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedFlow.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedFlow.image} 
                    alt={selectedFlow.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.querySelector('.placeholder-icon')?.classList.remove('hidden');
                    }}
                  />
                  <div className="placeholder-icon hidden">
                    <Workflow className="h-20 w-20 text-primary/40" />
                  </div>
                </div>

                {/* Integrations */}
                <div>
                  <h4 className="font-semibold mb-3">Integrações</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFlow.integrations.map((integration, idx) => (
                      <Badge key={idx} variant="secondary">{integration}</Badge>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="font-semibold mb-3">Como Funciona</h4>
                  <div className="space-y-3">
                    {selectedFlow.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3">Funcionalidades</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedFlow.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold mb-3">Resultados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFlow.benefits.map((benefit, idx) => (
                      <Badge key={idx} className="bg-primary/10 text-primary border-primary/20">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => handleContact(`Oi! Quero saber mais sobre o fluxo de automação: ${selectedFlow.name}`)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Quero essa automação
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Benefits Section */}
      <section className="py-16">
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
      <section className="py-24 bg-muted/30">
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
      <section className="py-16">
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
              Agende um bate papo e descubra como nossos agentes de IA podem transformar sua operação.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => handleContact("Oi! Quero agendar um bate papo sobre automação com IA")}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Agendar um Bate Papo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solucoes;
