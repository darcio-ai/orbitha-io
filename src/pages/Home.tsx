import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Calendar, 
  MessageSquare, 
  Zap, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles 
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const solutions = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Automação de WhatsApp",
      description: "IA conversacional para atendimento 24/7 no WhatsApp"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Integrações Inteligentes",
      description: "Google Agenda, planilhas e sistemas via Zapier e n8n"
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "Agentes de IA",
      description: "Assistentes virtuais personalizados para sua empresa"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Automação de Vendas",
      description: "Processos de vendas e atendimento otimizados"
    }
  ];

  const stats = [
    { number: "95%", label: "Redução no tempo de resposta" },
    { number: "24/7", label: "Atendimento disponível" },
    { number: "3x", label: "Aumento na produtividade" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Inteligência Artificial para Empresas
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Transforme seu
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                atendimento com IA
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Ajudamos pequenas e médias empresas a integrarem inteligência artificial 
              em seus processos, com foco em performance, simplicidade e resultado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a
                  href="https://wa.me/5513991497873?text=Oi! Quero conhecer as soluções da Orbitha"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Fale com a Dora
                </a>
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <a href="#solucoes">
                  Ver Soluções
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 justify-items-center">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
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
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solucoes" className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Nossas <span className="bg-gradient-primary bg-clip-text text-transparent">Soluções</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Automatize processos, melhore o atendimento e aumente a produtividade 
              da sua empresa com nossas soluções de IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-secondary/50 border-border hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-primary-foreground">
                      {solution.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                  <p className="text-muted-foreground">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Vamos conversar?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
              Me conta: o que tá tirando o seu sono ou te dando dor de cabeça aí no dia a dia? 
              Vamos descobrir juntos como a automação pode te ajudar a resolver isso. 💡
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a
                href="https://wa.me/5513991497873?text=Oi! Quero descobrir como a automação pode ajudar minha empresa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Conversar com a Dora
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
