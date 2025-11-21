import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Calendar, 
  MessageSquare, 
  Zap, 
  TrendingUp,
  ArrowRight,
  Sparkles 
} from "lucide-react";
import astronautHero from "@/assets/astronaut-hero.png";

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
    <div className="min-h-screen bg-background">
      {/* Animated Space Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 animate-fade-in">
              <Badge 
                variant="secondary" 
                className="backdrop-blur-xl bg-card/10 border border-border/20 text-primary px-4 py-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Inteligência Artificial para Empresas
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-space font-bold leading-tight">
                <span className="block text-foreground">Explorando o</span>
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Futuro da IA
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Ajudamos pequenas e médias empresas a integrarem inteligência artificial 
                em seus processos, com foco em performance, simplicidade e resultado.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-base font-semibold rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a
                    href="https://wa.me/5513991497873?text=Oi! Quero conhecer as soluções da Orbitha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Começar Agora
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 text-base font-semibold rounded-full backdrop-blur-xl bg-transparent border-border/60 hover:bg-card/20 hover:shadow-glow transition-all duration-300"
                  asChild
                >
                  <a href="#recursos">
                    Saiba Mais
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Right: Astronaut + HUD Cards */}
            <div className="relative h-[600px] lg:h-[700px]">
              <img 
                src={astronautHero} 
                alt="Astronauta Futurista" 
                className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto object-contain animate-float"
              />

              {/* HUD Card 1: Data Growth Chart */}
              <div className="absolute top-12 left-0 w-64 p-4 rounded-2xl backdrop-blur-xl bg-card/10 border border-border/20 shadow-cyber-glow animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-xs text-muted-foreground mb-2">Crescimento de Dados (TB)</p>
                <div className="h-24 flex items-end gap-1">
                  {[40, 55, 45, 70, 60, 85, 95].map((height, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-primary to-primary-glow rounded-t transition-all hover:scale-105"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* HUD Card 2: Neural Processing Circle */}
              <div className="absolute bottom-32 left-8 w-40 h-40 p-4 rounded-2xl backdrop-blur-xl bg-card/10 border border-border/20 shadow-cyber-glow animate-fade-in flex flex-col items-center justify-center" style={{ animationDelay: '0.4s' }}>
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="hsl(var(--border))"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - 0.94)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">94%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">Processamento Neural</p>
              </div>

              {/* HUD Card 3: Model Efficiency Bars */}
              <div className="absolute bottom-12 right-0 w-64 p-4 rounded-2xl backdrop-blur-xl bg-card/10 border border-border/20 shadow-cyber-glow animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <p className="text-xs text-muted-foreground mb-3">Eficiência do Modelo (%)</p>
                <div className="space-y-2">
                  {[
                    { label: 'Precisão', value: 96 },
                    { label: 'Velocidade', value: 88 },
                    { label: 'Otimização', value: 92 }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-primary font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary transition-all duration-1000"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center backdrop-blur-xl bg-card/5 p-6 rounded-2xl border border-border/10 hover:shadow-glow transition-all">
                <div className="text-4xl md:text-5xl font-bold font-space bg-gradient-primary bg-clip-text text-transparent mb-2">
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
      <section id="recursos" className="relative py-24 px-4">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-space font-bold">
              Nossas <span className="bg-gradient-primary bg-clip-text text-transparent">Soluções</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Automatize processos, melhore o atendimento e aumente a produtividade 
              da sua empresa com nossas soluções de IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-xl bg-card/10 border border-border/20 hover:shadow-cyber-glow transition-all duration-300 group hover:scale-105"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <div className="text-primary-foreground">
                      {solution.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-space font-semibold">{solution.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-gradient-cyber p-12 rounded-3xl border border-border/20 shadow-cyber-glow">
            <h2 className="text-4xl md:text-5xl font-space font-bold mb-6">
              Vamos conversar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Me conta: o que tá tirando o seu sono ou te dando dor de cabeça aí no dia a dia? 
              Vamos descobrir juntos como a automação pode te ajudar a resolver isso. 💡
            </p>
            <Button 
              size="lg" 
              className="h-14 px-8 text-base font-semibold rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
              asChild
            >
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
