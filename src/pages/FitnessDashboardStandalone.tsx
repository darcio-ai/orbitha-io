import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Dumbbell, Loader2 } from "lucide-react";
import DashboardFitness from "./DashboardFitness";

const FitnessDashboardStandalone = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      localStorage.setItem('fitness-redirect', '/fitness/dashboard');
      navigate("/login");
      return;
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/fitness")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sm sm:text-base">Meu Progresso</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/fitness/chat")}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <DashboardFitness />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-2 text-center">
        <a 
          href="https://orbitha.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          por Orbitha.io
        </a>
      </footer>
    </div>
  );
};

export default FitnessDashboardStandalone;
