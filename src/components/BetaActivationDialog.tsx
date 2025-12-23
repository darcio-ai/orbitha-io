import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Gift, CheckCircle } from "lucide-react";

interface BetaActivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistantId: string;
  assistantName: string;
  planType: "life_balance" | "growth" | "suite";
  couponCode: string;
}

export const BetaActivationDialog = ({
  open,
  onOpenChange,
  assistantId,
  assistantName,
  planType,
  couponCode,
}: BetaActivationDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    cpfCnpj: "",
  });

  useEffect(() => {
    if (open) {
      checkAuthAndPrefill();
    }
  }, [open]);

  const checkAuthAndPrefill = async () => {
    setCheckingAuth(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      // Validate session with getUser() to ensure token is valid
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("Invalid session detected:", userError);
        // Session is invalid/expired - force logout
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      setIsAuthenticated(true);

      // Prefill with profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("firstname, lastname, email, whatsapp, cpf_cnpj")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData({
          name: `${profile.firstname || ""} ${profile.lastname || ""}`.trim(),
          email: profile.email || user.email || "",
          whatsapp: profile.whatsapp || "",
          cpfCnpj: profile.cpf_cnpj || "",
        });
      } else {
        setFormData(prev => ({
          ...prev,
          email: user.email || "",
        }));
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = () => {
    onOpenChange(false);
    const currentPath = window.location.pathname;
    navigate(`/login?redirectTo=${encodeURIComponent(currentPath + "?openBeta=true")}`);
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      // CPF
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
    } else {
      // CNPJ
      if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.cpfCnpj) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-mercadopago", {
        body: {
          planType,
          billingInfo: {
            name: formData.name,
            email: formData.email,
            cpfCnpj: formData.cpfCnpj.replace(/\D/g, ""),
            whatsapp: formData.whatsapp.replace(/\D/g, ""),
          },
          couponCode,
        },
      });

      if (error) throw error;

      if (data.free_activation) {
        toast({
          title: "🎉 Beta ativado com sucesso!",
          description: `Seu acesso ao ${assistantName} está liberado até 15/01/2025.`,
        });
        onOpenChange(false);
        
        // Redirect to dashboard for combos, or specific chat for individual assistants
        const isCombo = ['life_balance', 'growth', 'suite'].includes(planType);
        const redirectUrl = isCombo ? '/dashboard/agents' : `/chat/${assistantId}`;
        navigate(redirectUrl);
      } else if (data.init_point) {
        // Shouldn't happen with 100% discount, but handle just in case
        window.location.href = data.init_point;
      }
    } catch (error: any) {
      console.error("Beta activation error:", error);
      
      // Try to extract real error message from response
      let errorMessage = "";
      let errorCode = "";
      
      // Check if error has context with response body
      if (error.context?.body) {
        try {
          const bodyText = await error.context.body.text?.() || error.context.body;
          const parsed = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText;
          errorMessage = parsed.error || parsed.message || "";
          errorCode = parsed.code || "";
        } catch {
          errorMessage = error.message || "";
        }
      } else {
        errorMessage = error.message || "";
      }
      
      // Check if it's a session expired error
      const isSessionExpired = errorCode === "session_expired" ||
                               errorMessage.includes("Sessão expirada") || 
                               errorMessage.includes("session_expired") ||
                               errorMessage.includes("JWT") ||
                               errorMessage.includes("User from sub claim") ||
                               errorMessage.includes("user_not_found");
      
      if (isSessionExpired) {
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou. Faça login novamente para continuar.",
          variant: "destructive",
        });
        
        // Force logout and redirect to login
        await supabase.auth.signOut();
        onOpenChange(false);
        const currentPath = window.location.pathname;
        navigate(`/login?redirectTo=${encodeURIComponent(currentPath + "?openBeta=true")}`);
        return;
      }
      
      // Show the actual error message from backend
      toast({
        title: "Erro na ativação",
        description: errorMessage || "Não foi possível ativar o beta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="w-6 h-6 text-primary" />
            Ativar Beta Grátis
          </DialogTitle>
          <DialogDescription className="text-base">
            Assistente <span className="font-semibold text-foreground">{assistantName}</span>
          </DialogDescription>
        </DialogHeader>

        {checkingAuth ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground text-center">
              Para ativar seu acesso beta gratuito, você precisa estar logado.
            </p>
            <Button onClick={handleLogin} className="w-full" size="lg">
              Fazer login para continuar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle className="w-4 h-4" />
                <span>Acesso até 15/01/2025 • Zero cobrança</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
              <Input
                id="cpfCnpj"
                value={formData.cpfCnpj}
                onChange={(e) => setFormData({ ...formData, cpfCnpj: formatCpfCnpj(e.target.value) })}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ativando...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Ativar meu acesso gratuito
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
