import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen bg-background relative">
      {/* Animated Space Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 md:pb-16 px-4">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6 md:space-y-8 animate-fade-in text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                  Inteligência Artificial para Empresas
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-space font-bold leading-tight">
                <span className="block text-foreground">Explorando o</span>
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Futuro da IA
                </span>
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Ajudamos pequenas e médias empresas a integrarem inteligência artificial 
                em seus processos, com foco em performance, simplicidade e resultado.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a
                    href="https://wa.me/5513991497873?text=Oi! Quero conhecer as soluções da Orbitha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                    Começar Agora
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-full backdrop-blur-xl bg-transparent border-border/60 hover:bg-card/20 hover:shadow-glow transition-all duration-300"
                  asChild
                >
                  <a href="#recursos">
                    Saiba Mais
                    <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Right: Astronaut + HUD Cards */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[700px] mt-8 lg:mt-0">
              <img 
                src={astronautHero} 
                alt="Astronauta Futurista" 
                className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto object-contain animate-float"
              />

              {/* HUD Card 1: Data Growth Line Chart */}
              <div className="absolute top-4 md:top-12 left-0 w-48 md:w-64 p-3 md:p-4 rounded-2xl backdrop-blur-xl bg-card/10 border border-border/20 shadow-cyber-glow animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-xs text-muted-foreground mb-2">Crescimento de Dados (TB)</p>
                <div className="h-16 md:h-24 relative">
                  <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="200" y2="20" stroke="hsl(var(--border))" strokeOpacity="0.2" />
                    <line x1="0" y1="40" x2="200" y2="40" stroke="hsl(var(--border))" strokeOpacity="0.2" />
                    <line x1="0" y1="60" x2="200" y2="60" stroke="hsl(var(--border))" strokeOpacity="0.2" />
                    
                    {/* Gradient fill under line */}
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,60 Q25,55 40,48 T80,35 T120,28 T160,18 T200,8 V80 H0 Z"
                      fill="url(#lineGradient)"
                    />
                    
                    {/* Line */}
                    <path
                      d="M0,60 Q25,55 40,48 T80,35 T120,28 T160,18 T200,8"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_6px_hsl(var(--primary))]"
                    />
                    
                    {/* Data points */}
                    {[[0, 60], [40, 48], [80, 35], [120, 28], [160, 18], [200, 8]].map(([x, y], i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="hsl(var(--primary))"
                        className="drop-shadow-[0_0_4px_hsl(var(--primary))]"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* HUD Card 2: Neural Processing Circle */}
              <div className="absolute bottom-24 md:bottom-32 left-2 md:left-8 w-32 h-32 md:w-40 md:h-40 p-3 md:p-4 rounded-2xl backdrop-blur-xl bg-card/10 border border-border/20 shadow-cyber-glow animate-fade-in flex flex-col items-center justify-center" style={{ animationDelay: '0.4s' }}>
                <div className="relative w-20 h-20 md:w-24 md:h-24">
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
                    <span className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">94%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">Processamento Neural</p>
              </div>

              {/* HUD Card 3: Model Efficiency Bars */}
              <div className="absolute bottom-4 md:bottom-12 right-0 w-48 md:w-64 p-3 md:p-4 rounded-2xl backdrop-blur-xl bg-card/10 border border-border/20 shadow-cyber-glow animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-24 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center backdrop-blur-xl bg-card/5 p-4 md:p-6 rounded-2xl border border-border/10 hover:shadow-glow transition-all">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-space bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="recursos" className="relative py-12 md:py-24 px-4">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-space font-bold">
              Nossas <span className="bg-gradient-primary bg-clip-text text-transparent">Soluções</span>
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Automatize processos, melhore o atendimento e aumente a produtividade 
              da sua empresa com nossas soluções de IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {solutions.map((solution, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-xl bg-card/10 border border-border/20 hover:shadow-cyber-glow transition-all duration-300 group hover:scale-105"
              >
                <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <div className="text-primary-foreground">
                      {solution.icon}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-space font-semibold">{solution.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-24 px-4">
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-gradient-cyber p-6 md:p-12 rounded-3xl border border-border/20 shadow-cyber-glow">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-space font-bold mb-4 md:mb-6">
              Vamos conversar?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto">
              Me conta: o que tá tirando o seu sono ou te dando dor de cabeça aí no dia a dia? 
              Vamos descobrir juntos como a automação pode te ajudar a resolver isso. 💡
            </p>
            <Button 
              size="lg" 
              className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
              asChild
            >
              <a
                href="https://wa.me/5513991497873?text=Oi! Quero descobrir como a automação pode ajudar minha empresa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="mr-2 h-4 md:h-5 w-4 md:w-5" />
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
