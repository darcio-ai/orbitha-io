import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { usePasswordCheck } from "@/hooks/usePasswordCheck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, CreditCard, Crown, Shield, Mail, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCpfCnpj } from "@/lib/utils";
import { z } from "zod";

interface ProfileData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  whatsapp: string;
  billing_name: string | null;
  cpf_cnpj: string | null;
}

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "A senha deve ter pelo menos 6 caracteres");

const Profile = () => {
  const { toast } = useToast();
  const { subscription, isActive, planType, isLoading: subscriptionLoading } = useUserSubscription();
  const { isCompromised, isChecking, checkPassword, resetCheck } = usePasswordCheck();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    whatsapp: "",
    billing_name: null,
    cpf_cnpj: null,
  });

  // Estados para alteração de email
  const [newEmail, setNewEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  // Estados para alteração de senha
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordChecked, setPasswordChecked] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar senha vazada com debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!newPassword || newPassword.length < 6) {
      resetCheck();
      setPasswordChecked(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      await checkPassword(newPassword);
      setPasswordChecked(true);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [newPassword, checkPassword, resetCheck]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("firstname, lastname, email, phone, whatsapp, billing_name, cpf_cnpj")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfileData(data);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          firstname: profileData.firstname,
          lastname: profileData.lastname,
          phone: profileData.phone,
          whatsapp: profileData.whatsapp,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dados pessoais atualizados com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangeEmail = async () => {
    try {
      emailSchema.parse(newEmail);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Erro",
          description: err.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setChangingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });

      if (error) throw error;

      toast({
        title: "Verificação enviada",
        description: "Um link de confirmação foi enviado para o novo email. Verifique sua caixa de entrada.",
      });
      setNewEmail("");
    } catch (error: any) {
      console.error("Erro ao alterar email:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar o email.",
        variant: "destructive",
      });
    } finally {
      setChangingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      passwordSchema.parse(newPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Erro",
          description: err.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se a senha foi vazada
    if (isCompromised) {
      toast({
        title: "Senha comprometida",
        description: "Esta senha foi encontrada em vazamentos de dados. Por favor, escolha outra senha.",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso!",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar a senha.",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getPlanName = (plan: string | null) => {
    if (plan === "life_balance") return "Life Balance";
    if (plan === "growth") return "Growth Pack";
    if (plan === "suite") return "Orbitha Suite";
    return "Nenhum";
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e assinatura</p>
      </div>

      <div className="space-y-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Dados Pessoais</CardTitle>
            </div>
            <CardDescription>
              Suas informações básicas de cadastro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Nome</Label>
                <Input
                  id="firstname"
                  value={profileData.firstname}
                  onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Sobrenome</Label>
                <Input
                  id="lastname"
                  value={profileData.lastname}
                  onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Para alterar o email, use a seção "Segurança" abaixo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={profileData.whatsapp}
                  onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Segurança</CardTitle>
            </div>
            <CardDescription>
              Altere seu email ou senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alterar Email */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label className="text-base font-medium">Alterar Email</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newEmail">Novo Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="Digite o novo email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Um link de confirmação será enviado para o novo email. Você precisará confirmar para concluir a alteração.
                </p>
              </div>
              <Button 
                onClick={handleChangeEmail} 
                disabled={changingEmail || !newEmail}
                variant="outline"
              >
                {changingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Alterar Email
              </Button>
            </div>

            <Separator />

            {/* Alterar Senha */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label className="text-base font-medium">Alterar Senha</Label>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={isCompromised ? "border-destructive" : ""}
                  />
                  {/* Feedback de verificação de senha */}
                  {newPassword.length >= 6 && (
                    <div className="flex items-center gap-2 text-sm">
                      {isChecking ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          <span className="text-muted-foreground">Verificando segurança...</span>
                        </>
                      ) : isCompromised ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="text-destructive">Esta senha foi vazada em um data breach. Escolha outra.</span>
                        </>
                      ) : passwordChecked ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Senha segura</span>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleChangePassword} 
                disabled={changingPassword || !newPassword || !confirmPassword || isChecking || isCompromised === true}
                variant="outline"
              >
                {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Alterar Senha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dados de Cobrança */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Dados de Cobrança</CardTitle>
            </div>
            <CardDescription>
              Informações utilizadas nas suas transações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome de Cobrança</Label>
              <Input
                value={profileData.billing_name || "Não informado"}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>CPF/CNPJ</Label>
              <Input
                value={profileData.cpf_cnpj ? formatCpfCnpj(profileData.cpf_cnpj) : "Não informado"}
                disabled
                className="bg-muted"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Os dados de cobrança são atualizados automaticamente quando você realiza um pagamento
            </p>
          </CardContent>
        </Card>

        {/* Assinatura */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              <CardTitle>Assinatura</CardTitle>
            </div>
            <CardDescription>
              Status e detalhes da sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="text-lg font-semibold mt-1">
                  {isActive ? (
                    <span className="text-green-600">✓ Ativa</span>
                  ) : (
                    <span className="text-muted-foreground">Inativa</span>
                  )}
                </p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Plano Atual</Label>
                <p className="text-lg font-semibold mt-1">
                  {getPlanName(planType)}
                </p>
              </div>
            </div>

            {isActive && subscription?.subscription_end_date && (
              <div>
                <Label className="text-sm text-muted-foreground">Data de Renovação</Label>
                <p className="text-lg font-semibold mt-1">
                  {formatDate(subscription.subscription_end_date)}
                </p>
              </div>
            )}

            <Separator />

            {!isActive ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Você não possui uma assinatura ativa no momento.
                </p>
                <Button asChild>
                  <Link to="/pricing">Ver Planos Disponíveis</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Deseja mudar de plano ou cancelar?
                </p>
                <Button variant="outline" asChild>
                  <Link to="/pricing">Gerenciar Assinatura</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
