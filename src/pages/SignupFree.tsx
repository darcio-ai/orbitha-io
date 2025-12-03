import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const signupSchema = z.object({
  fullName: z.string()
    .trim()
    .min(3, "Nome completo deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo"),
  whatsapp: z.string()
    .trim()
    .min(1, "WhatsApp é obrigatório")
    .refine((val) => {
      // Remove all non-digit characters
      const digits = val.replace(/\D/g, '');
      // Must have at least 10 digits (DDD + number)
      return digits.length >= 10;
    }, {
      message: "Digite um número válido com DDD (ex: 11999999999)"
    }),
  password: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha muito longa"),
  confirmPassword: z.string(),
  age: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupFree = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Format WhatsApp: accepts any format, outputs +55 (XX) XXXXX-XXXX
  const formatWhatsApp = (value: string): string => {
    // Extract only digits
    let digits = value.replace(/\D/g, '');
    
    // If already has country code (starts with 55 and has 12-13 digits), keep it
    if (digits.startsWith('55') && digits.length >= 12) {
      return '+' + digits;
    }
    
    // Otherwise, add Brazilian country code
    return '+55' + digits;
  };

  // Format display as user types
  const formatPhoneDisplay = (value: string): string => {
    // Extract only digits
    let digits = value.replace(/\D/g, '');
    
    // Remove 55 prefix if present for formatting
    if (digits.startsWith('55') && digits.length > 11) {
      digits = digits.substring(2);
    }
    
    // Format: (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneDisplay(e.target.value);
    e.target.value = formatted;
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const nameParts = data.fullName.trim().split(" ");
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(" ") || "";
      
      // Format WhatsApp to international standard with +55
      const formattedWhatsApp = formatWhatsApp(data.whatsapp);

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            firstname,
            lastname,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile with all data including whatsapp
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            whatsapp: formattedWhatsApp,
            plan: "free",
            age: data.age ? parseInt(data.age) : null,
          })
          .eq("id", authData.user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          throw profileError;
        }

        // Get Financial Assistant agent ID and give user access
        const { data: agents, error: agentError } = await supabase
          .from("agents")
          .select("id")
          .eq("name", "Assistente Financeiro")
          .eq("status", "active")
          .single();

        if (agentError) {
          console.error("Agent error:", agentError);
          throw new Error("Erro ao buscar agente. Por favor, contate o suporte.");
        }

        if (!agents) {
          throw new Error("Agente Assistente Financeiro não encontrado. Por favor, contate o suporte.");
        }

        const { error: agentAccessError } = await supabase
          .from("agents_users")
          .insert({
            user_id: authData.user.id,
            agent_id: agents.id,
          });

        if (agentAccessError) {
          console.error("Agent access error:", agentAccessError);
          throw new Error("Falha ao atribuir acesso ao agente. Por favor, contate o suporte.");
        }

        toast({
          title: "Bem-vindo à Orbitha!",
          description: "Sua conta foi criada com sucesso. Experimente nossos assistentes!",
        });

        // Navigate to assistant
        navigate("/assistentes/financial-assistant");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Experimente os Assistentes de IA da Orbitha
          </CardTitle>
          <CardDescription className="text-base">
            Conheça todos os assistentes antes de assinar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="João Silva"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="joao@exemplo.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                type="tel"
                {...register("whatsapp", {
                  onChange: handlePhoneChange
                })}
                placeholder="(11) 99999-9999"
                disabled={isLoading}
              />
              {errors.whatsapp && (
                <p className="text-sm text-destructive mt-1">{errors.whatsapp.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                +55 será adicionado automaticamente
              </p>
            </div>

            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Digite a senha novamente"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Ao cadastrar, você concorda com nossos{" "}
            <Link to="/termos" className="text-primary hover:underline">
              termos de uso
            </Link>
          </p>

          <p className="text-sm text-center">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupFree;
