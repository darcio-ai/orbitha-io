import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      // Remove all non-digit characters except +
      const cleaned = val.replace(/[^\d+]/g, '');
      // Check if it has at least 8 digits and starts with + or (
      return cleaned.length >= 10 && (cleaned.startsWith('+') || val.startsWith('('));
    }, {
      message: "Formato inválido. Use +55 (11) 99999-9999 ou internacional +xx"
    }),
  password: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha muito longa"),
  confirmPassword: z.string(),
  age: z.string().optional(),
  monthlyIncome: z.string().optional(),
  financialGoal: z.string().optional(),
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
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const financialGoal = watch("financialGoal");

  // Format WhatsApp to international format
  const formatWhatsApp = (value: string): string => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // If starts with ( assume Brazilian format and add +55
    if (value.trim().startsWith('(') && !cleaned.startsWith('+')) {
      cleaned = '+55' + cleaned;
    }
    
    return cleaned;
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const nameParts = data.fullName.trim().split(" ");
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(" ") || "";
      
      // Format WhatsApp to international standard
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
            monthly_income: data.monthlyIncome ? parseFloat(data.monthlyIncome) : null,
            financial_goal: data.financialGoal || null,
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
          .eq("name", "Financial Assistant Premium")
          .eq("status", "active")
          .single();

        if (agentError) {
          console.error("Agent error:", agentError);
          throw new Error("Erro ao buscar agente. Por favor, contate o suporte.");
        }

        if (!agents) {
          throw new Error("Agente Financial Assistant Premium não encontrado. Por favor, contate o suporte.");
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
          title: "Bem-vindo ao Financial Assistant Premium!",
          description: "Sua conta gratuita foi criada com sucesso.",
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
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">
            Comece Grátis com o Score Patrimonial
          </CardTitle>
          <CardDescription className="text-lg">
            Descubra seu Score Patrimonial 0-100 em menos de 2 minutos
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Required Fields */}
            <div className="space-y-4">
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
                  {...register("whatsapp")}
                  placeholder="+55 (11) 99999-9999"
                  disabled={isLoading}
                />
                {errors.whatsapp && (
                  <p className="text-sm text-destructive mt-1">{errors.whatsapp.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: +55 (11) 99999-9999 ou internacional +xx
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
            </div>

            {/* Optional Fields */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Campos opcionais (nos ajudam a personalizar sua experiência):
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register("age")}
                    placeholder="35"
                    min="18"
                    max="120"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyIncome">Renda Mensal Aproximada</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    {...register("monthlyIncome")}
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="financialGoal">Objetivo Financeiro Principal</Label>
                  <Select
                    value={financialGoal}
                    onValueChange={(value) => setValue("financialGoal", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organizar">Organizar finanças</SelectItem>
                      <SelectItem value="investir">Investir melhor</SelectItem>
                      <SelectItem value="casa">Comprar casa própria</SelectItem>
                      <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                      <SelectItem value="educacao">Educação dos filhos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                "Criar Conta Gratuita"
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
