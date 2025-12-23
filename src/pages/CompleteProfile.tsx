import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, CheckCircle } from "lucide-react";

const CompleteProfile = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    whatsapp: "",
    cpfCnpj: "",
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the intended destination from location state
  const redirectTo = (location.state as any)?.from || "/assistentes";

  useEffect(() => {
    checkAuthAndPrefill();
  }, []);

  const checkAuthAndPrefill = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      // Get existing profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("firstname, lastname, email, whatsapp, cpf_cnpj")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        // Check if profile is already complete
        if (profile.whatsapp && profile.cpf_cnpj) {
          navigate(redirectTo, { replace: true });
          return;
        }

        setFormData({
          firstname: profile.firstname || "",
          lastname: profile.lastname || "",
          email: profile.email || session.user.email || "",
          whatsapp: profile.whatsapp || "",
          cpfCnpj: profile.cpf_cnpj || "",
        });
      } else {
        // Extract name from user metadata if available
        const metadata = session.user.user_metadata || {};
        const fullName = metadata.full_name || metadata.name || "";
        const nameParts = fullName.split(" ");
        
        setFormData(prev => ({
          ...prev,
          firstname: nameParts[0] || "",
          lastname: nameParts.slice(1).join(" ") || "",
          email: session.user.email || "",
        }));
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setCheckingAuth(false);
    }
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
    
    if (!formData.firstname || !formData.whatsapp || !formData.cpfCnpj) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validate WhatsApp (must have at least 10 digits)
    const whatsappNumbers = formData.whatsapp.replace(/\D/g, "");
    if (whatsappNumbers.length < 10) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, insira um número de WhatsApp válido.",
        variant: "destructive",
      });
      return;
    }

    // Validate CPF/CNPJ (must have 11 or 14 digits)
    const cpfCnpjNumbers = formData.cpfCnpj.replace(/\D/g, "");
    if (cpfCnpjNumbers.length !== 11 && cpfCnpjNumbers.length !== 14) {
      toast({
        title: "CPF/CNPJ inválido",
        description: "Por favor, insira um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          firstname: formData.firstname,
          lastname: formData.lastname,
          whatsapp: whatsappNumbers,
          cpf_cnpj: cpfCnpjNumbers,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Seus dados foram salvos com sucesso.",
      });

      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img
              src="/favicon.png"
              alt="Orbitha Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-foreground">Orbitha</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Complete seu Perfil</CardTitle>
            <CardDescription className="text-center">
              Precisamos de alguns dados para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span>Seus dados estão seguros conosco</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">Nome *</Label>
                  <Input
                    id="firstname"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    placeholder="Seu nome"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Sobrenome</Label>
                  <Input
                    id="lastname"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    placeholder="Seu sobrenome"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                  placeholder="(11) 99999-9999"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF ou CNPJ *</Label>
                <Input
                  id="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData({ ...formData, cpfCnpj: formatCpfCnpj(e.target.value) })}
                  placeholder="000.000.000-00"
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteProfile;
