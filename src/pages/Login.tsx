import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import orbithaLogo from "@/assets/orbitha-logo.png";

const Login = () => {
  const [emailOrWhatsApp, setEmailOrWhatsApp] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = (location.state as any)?.from || "/dashboard";

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isWhatsApp = (value: string) => {
    // Accepts formats: +55 (11) 99999-9999, +5511999999999, etc.
    return /^\+?[\d\s()-]+$/.test(value) && value.replace(/\D/g, '').length >= 10;
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(from, { replace: true });
      }
    };
    checkUser();

    // Load saved credentials if remember me was checked
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedRememberMe) {
      const savedEmail = localStorage.getItem('savedEmail');
      const savedPassword = localStorage.getItem('savedPassword');
      if (savedEmail) setEmailOrWhatsApp(savedEmail);
      if (savedPassword) setPassword(savedPassword);
      setRememberMe(true);
    }
  }, [navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let loginEmail = emailOrWhatsApp.trim();

      // If input is WhatsApp, fetch associated email
      if (isWhatsApp(emailOrWhatsApp)) {
        const cleanWhatsApp = emailOrWhatsApp.replace(/\D/g, '');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('whatsapp', cleanWhatsApp)
          .single();

        if (profileError || !profile) {
          throw new Error("WhatsApp não encontrado. Use o email cadastrado ou verifique o número.");
        }

        loginEmail = profile.email;
      } else if (!isEmail(emailOrWhatsApp)) {
        throw new Error("Por favor, insira um email ou WhatsApp válido.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Store remember me preference and credentials
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedEmail', emailOrWhatsApp);
          localStorage.setItem('savedPassword', password);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {/* Logo da Orbitha */}
      <Link to="/" className="mb-8 transition-opacity hover:opacity-80">
        <img 
          src={orbithaLogo} 
          alt="Orbitha Logo" 
          className="h-16 w-auto"
        />
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Entre na sua conta</CardTitle>
          <CardDescription className="text-center">
            Acesse seu Score Patrimonial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrWhatsApp">Email ou WhatsApp</Label>
              <Input
                id="emailOrWhatsApp"
                type="text"
                placeholder="seu@email.com ou +55 (11) 99999-9999"
                value={emailOrWhatsApp}
                onChange={(e) => setEmailOrWhatsApp(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={loading}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer"
              >
                Lembrar de mim
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <Link
                to="/recuperar-senha"
                className="text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
              <Link
                to="/cadastro-gratuito"
                className="text-primary hover:underline"
              >
                Não tem conta? Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
