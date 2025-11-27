import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { syncUserProfile } from "@/services/profile";

const Login = () => {
  const [emailOrWhatsApp, setEmailOrWhatsApp] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Prioritize redirectTo from URL, then location state, then default to /dashboard
  const redirectTo = searchParams.get('redirectTo') || (location.state as any)?.from || "/dashboard";

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
        await syncUserProfile(session.user);
        navigate(redirectTo, { replace: true });
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
  }, [navigate, redirectTo]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar com Google",
        description: error.message,
      });
      setLoading(false);
    }
  };

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

      // 1. Tentar Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        // Se o erro for de credenciais inválidas, pode ser que o usuário não exista
        // Vamos tentar criar a conta (SignUp)
        if (error.message.includes("Invalid login credentials")) {
          // Tentar criar conta
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: loginEmail,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}${redirectTo}`,
            }
          });
          return;
        }

        // Se não for erro de credenciais ou se o signup não foi tentado/falhou de outra forma
        throw error;
      }

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

        await syncUserProfile(data.session.user);
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
        navigate(redirectTo, { replace: true });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login/cadastro",
        description: error.message || "Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      {/* Header com Logo e Navegação */}
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

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/mentoria" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Mentoria
            </Link>
            <Link to="/solucoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Soluções
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo da página de login */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Entre na sua conta</CardTitle>
            <CardDescription className="text-center">
              Acesse seu Score Patrimonial e Assistentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                )}
                Entrar com Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

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
                    "Entrar com Email"
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
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground mt-4">
              Ao continuar, você concorda com os termos de uso da Orbitha.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
