import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInstallPWA } from "@/hooks/useInstallPWA";
import { supabase } from "@/integrations/supabase/client";
import { Download, MessageCircle, BarChart3, Dumbbell } from "lucide-react";

const FitnessStandalone = () => {
  const navigate = useNavigate();
  const { canInstall, isInstalled, promptInstall } = useInstallPWA();

  useEffect(() => {
    // Load fitness-specific manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute('href', '/manifest-fitness.json');
    }
    
    // Set theme color
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', '#22c55e');
    }
  }, []);

  const handleStartChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/fitness/chat");
    } else {
      // Store redirect destination
      localStorage.setItem('fitness-redirect', '/fitness/chat');
      navigate("/login");
    }
  };

  const handleDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/fitness/dashboard");
    } else {
      localStorage.setItem('fitness-redirect', '/fitness/dashboard');
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-green-950/20 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Fitness Coach
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Hero Image */}
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-600/30 blur-2xl animate-pulse"></div>
            <img
              src="/agents/agente_fitness.png"
              alt="Fitness Coach"
              className="relative w-full h-full rounded-full object-cover border-4 border-green-500/40"
            />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Seu Coach de IA Pessoal
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Treinos personalizados, nutrição inteligente e acompanhamento de hábitos saudáveis
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            {canInstall && !isInstalled && (
              <Button
                onClick={promptInstall}
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-14 text-base gap-2"
              >
                <Download className="h-5 w-5" />
                Instalar App
              </Button>
            )}

            {isInstalled && (
              <div className="flex items-center justify-center gap-2 text-green-500 py-2">
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">App instalado!</span>
              </div>
            )}

            <Button
              onClick={handleStartChat}
              size="lg"
              variant={canInstall && !isInstalled ? "outline" : "default"}
              className={`w-full h-14 text-base gap-2 ${
                !canInstall || isInstalled 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" 
                  : "border-green-500/50 hover:bg-green-500/10"
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              Começar Treino
            </Button>

            <Button
              onClick={handleDashboard}
              size="lg"
              variant="ghost"
              className="w-full h-12 text-base gap-2 text-muted-foreground hover:text-foreground"
            >
              <BarChart3 className="h-5 w-5" />
              Meu Dashboard
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center space-y-1">
              <div className="mx-auto w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <span className="text-xl">🏋️</span>
              </div>
              <p className="text-xs text-muted-foreground">Treinos</p>
            </div>
            <div className="text-center space-y-1">
              <div className="mx-auto w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <span className="text-xl">🥗</span>
              </div>
              <p className="text-xs text-muted-foreground">Nutrição</p>
            </div>
            <div className="text-center space-y-1">
              <div className="mx-auto w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <p className="text-xs text-muted-foreground">Progresso</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <a 
          href="https://orbitha.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          por Orbitha.io
        </a>
      </footer>
    </div>
  );
};

export default FitnessStandalone;
