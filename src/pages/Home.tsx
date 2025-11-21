import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroAstronaut from "@/assets/hero-astronaut.png";
import { TrendingUp, Activity, BarChart3 } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Space background */}
        <div className="absolute inset-0 z-0 bg-[#0a0e27]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10 py-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">Explorando o</span>
                <span className="block bg-gradient-cyber bg-clip-text text-transparent">
                  Futuro da IA
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                Plataforma avançada para análise de dados e machine learning no espaço.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-cyber-cyan to-cyber-blue hover:shadow-cyber-glow transition-all duration-300"
                  asChild
                >
                  <a
                    href="https://wa.me/5513991497873?text=Oi! Quero conhecer as soluções da Orbitha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Começar Agora
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan backdrop-blur-sm"
                  asChild
                >
                  <a href="#solucoes">
                    Saiba Mais
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Astronaut with Floating Cards */}
            <div className="relative hidden lg:block">
              <img 
                src={heroAstronaut} 
                alt="Astronauta explorando IA no espaço" 
                className="w-full h-auto object-contain relative z-10"
              />
              
              {/* Floating Card 1 - Growth Chart */}
              <Card className="absolute top-8 left-0 w-48 bg-background/10 backdrop-blur-md border-white/20 animate-float shadow-cyber-glow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-cyber-cyan" />
                    <span className="text-xs text-gray-300">Crescimento de Dados (TB)</span>
                  </div>
                  <div className="h-16 flex items-end gap-1">
                    <div className="flex-1 bg-gradient-to-t from-cyber-cyan to-cyber-blue h-8 rounded-sm opacity-60" />
                    <div className="flex-1 bg-gradient-to-t from-cyber-cyan to-cyber-blue h-12 rounded-sm opacity-70" />
                    <div className="flex-1 bg-gradient-to-t from-cyber-cyan to-cyber-blue h-10 rounded-sm opacity-80" />
                    <div className="flex-1 bg-gradient-to-t from-cyber-cyan to-cyber-blue h-16 rounded-sm" />
                  </div>
                </CardContent>
              </Card>

              {/* Floating Card 2 - Neural Processing */}
              <Card className="absolute bottom-32 left-4 w-44 bg-background/10 backdrop-blur-md border-white/20 shadow-cyber-glow" style={{ animationDelay: '0.5s' }}>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-cyber-purple" />
                    <span className="text-xs text-gray-300">Processamento Neural</span>
                  </div>
                  <div className="relative w-20 h-20 mx-auto">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-gray-700"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 32}
                        strokeDashoffset={2 * Math.PI * 32 * (1 - 0.94)}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--cyber-cyan))" />
                          <stop offset="100%" stopColor="hsl(var(--cyber-purple))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-cyber-neon">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Card 3 - Model Efficiency */}
              <Card className="absolute bottom-8 right-0 w-52 bg-background/10 backdrop-blur-md border-white/20 shadow-cyber-glow" style={{ animationDelay: '1s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-cyber-blue" />
                    <span className="text-xs text-gray-300">Eficiência do Modelo (RL)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan w-[85%]" />
                      </div>
                      <span className="text-xs text-gray-400">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan w-[92%]" />
                      </div>
                      <span className="text-xs text-gray-400">92%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan w-[78%]" />
                      </div>
                      <span className="text-xs text-gray-400">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
