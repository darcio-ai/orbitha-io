import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

const RecuperarSenha = () => {
  const [emailOrWhatsApp, setEmailOrWhatsApp] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isWhatsApp = (value: string) => {
    return /^\+?[\d\s()-]+$/.test(value) && value.replace(/\D/g, '').length >= 10;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resetEmail = emailOrWhatsApp.trim();

      // If input is WhatsApp, fetch associated email
      if (isWhatsApp(emailOrWhatsApp)) {
        const cleanWhatsApp = emailOrWhatsApp.replace(/\D/g, '');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('whatsapp', cleanWhatsApp)
          .single();

        if (profileError || !profile) {
          throw new Error("WhatsApp não encontrado no sistema. Use o email cadastrado.");
        }

        resetEmail = profile.email;
        toast({
          title: "Email encontrado",
          description: `Enviaremos o link de recuperação para o email associado ao WhatsApp.`,
        });
      } else if (!isEmail(emailOrWhatsApp)) {
        throw new Error("Por favor, insira um email ou WhatsApp válido.");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao recuperar senha",
        description: error.message || "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Email Enviado!</CardTitle>
            <CardDescription>
              Verifique sua caixa de entrada e spam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md space-y-2">
              <p className="text-sm text-muted-foreground">
                Enviamos um link de recuperação de senha para seu email.
              </p>
              <p className="text-sm text-muted-foreground">
                O link é válido por 1 hora.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-center">
            Informe seu email ou WhatsApp cadastrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrWhatsApp">Email ou WhatsApp cadastrado</Label>
              <Input
                id="emailOrWhatsApp"
                type="text"
                placeholder="seu@email.com ou +55 (11) 99999-9999"
                value={emailOrWhatsApp}
                onChange={(e) => setEmailOrWhatsApp(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Se usar WhatsApp, enviaremos o link para o email vinculado.
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar link de recuperação"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              asChild
            >
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Login
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecuperarSenha;
