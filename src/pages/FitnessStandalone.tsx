import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInstallPWA } from "@/hooks/useInstallPWA";
import { supabase } from "@/integrations/supabase/client";
import { Download, MessageCircle, BarChart3, Dumbbell, LogOut, User, Share, ExternalLink } from "lucide-react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

const FitnessStandalone = () => {
  const navigate = useNavigate();
  const { canInstall, isInstalled, promptInstall, isIOS, isMobile, isInOtherPWA } = useInstallPWA({
    manifestPath: '/manifest-fitness.json'
  });
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load fitness-specific manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute('href', '/manifest-fitness.json');
    }
    
    // Set theme color (primary purple)
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', '#6366f1');
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartChat = () => {
    if (user) {
      navigate("/fitness/chat");
    } else {
      localStorage.setItem('fitness-redirect', '/fitness/chat');
      navigate("/login");
    }
  };

  const handleDashboard = () => {
    if (user) {
      navigate("/fitness/dashboard");
    } else {
      localStorage.setItem('fitness-redirect', '/fitness/dashboard');
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  // iOS Install Instructions Component
  const IOSInstallInstructions = () => (
    <div className="w-full p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Share className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="font-medium text-sm text-foreground">Instalar no iPhone/iPad</p>
          <ol className="text-xs text-muted-foreground space-y-1">
            <li>1. Toque no botão <span className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded bg-muted"><Share className="h-3 w-3" /></span> (Compartilhar)</li>
            <li>2. Role e toque em "Adicionar à Tela de Início"</li>
            <li>3. Toque em "Adicionar" para confirmar</li>
          </ol>
        </div>
      </div>
    </div>
  );

  // Instructions when accessing from another PWA (e.g., main Orbitha app)
  const OtherPWAInstructions = () => (
    <div className="w-full p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
          <ExternalLink className="h-5 w-5 text-amber-400" />
        </div>
        <div className="space-y-2">
          <p className="font-medium text-sm text-foreground">Instalar App Separado</p>
          <p className="text-xs text-muted-foreground">
            Você está acessando pelo app Orbitha. Para instalar o Fitness Coach como app separado:
          </p>
          <ol className="text-xs text-muted-foreground space-y-1">
            <li>1. Abra <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">orbitha.io/fitness</code> no navegador</li>
            <li>2. Clique em "Instalar App" ou use as instruções de instalação</li>
          </ol>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/10 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Fitness Coach
          </span>
        </div>
        
        {/* User status / Logout */}
        {!loading && user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline text-xs truncate max-w-[100px]">
              {user.email?.split('@')[0]}
            </span>
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Hero Image */}
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 blur-2xl animate-pulse"></div>
            <img
              src="/agents/agente_fitness.png"
              alt="Fitness Coach"
              className="relative w-full h-full rounded-full object-cover border-4 border-primary/40"
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
            {/* Android/Chrome Install Button - Only show on mobile */}
            {canInstall && !isInstalled && isMobile && (
              <Button
                onClick={promptInstall}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-14 text-base gap-2"
              >
                <Download className="h-5 w-5" />
                Instalar App
              </Button>
            )}

            {/* Show instructions when inside another PWA (e.g., main Orbitha app) */}
            {isInOtherPWA && isMobile && (
              <OtherPWAInstructions />
            )}

            {/* iOS Install Instructions - Only show on mobile iOS when not in another PWA */}
            {isIOS && !isInstalled && !canInstall && isMobile && !isInOtherPWA && (
              <IOSInstallInstructions />
            )}

            <Button
              onClick={handleStartChat}
              size="lg"
              variant={canInstall && isMobile ? "outline" : "default"}
              className={`w-full h-14 text-base gap-2 ${
                !canInstall || !isMobile
                  ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground" 
                  : "border-primary/50 hover:bg-primary/10"
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
              <div className="mx-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xl">🏋️</span>
              </div>
              <p className="text-xs text-muted-foreground">Treinos</p>
            </div>
            <div className="text-center space-y-1">
              <div className="mx-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xl">🥗</span>
              </div>
              <p className="text-xs text-muted-foreground">Nutrição</p>
            </div>
            <div className="text-center space-y-1">
              <div className="mx-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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