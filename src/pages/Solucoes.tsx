import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Clock
} from "lucide-react";

const Solucoes = () => {
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
    }
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, number: "100+", label: "Empresas atendidas" },
    { icon: <BarChart3 className="h-8 w-8" />, number: "95%", label: "Redução no tempo de resposta" },
    { icon: <Clock className="h-8 w-8" />, number: "24/7", label: "Disponibilidade" },
    { icon: <Zap className="h-8 w-8" />, number: "3x", label: "Aumento na produtividade" }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Soluções em IA
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Soluções que <span className="bg-gradient-primary bg-clip-text text-transparent">transformam</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Descubra como nossas soluções de inteligência artificial podem revolucionar 
              os processos da sua empresa e aumentar sua produtividade.
            </p>
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

      {/* Solutions Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-6">
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
                    <Button className="w-full mt-8" asChild>
                      <a
                        href={`https://wa.me/5513991497873?text=Oi! Quero saber mais sobre: ${solution.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Quero essa solução
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Não deixe sua concorrência sair na frente. Vamos conversar sobre como 
              podemos automatizar seus processos hoje mesmo.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a
                href="https://wa.me/5513991497873?text=Oi! Quero implementar soluções de IA na minha empresa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Falar com Especialista
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solucoes;