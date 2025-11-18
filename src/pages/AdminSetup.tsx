import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AdminGuard } from "@/components/AdminGuard";

function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const setupAdmin = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Não autenticado",
          description: "Por favor, faça login primeiro como administrador.",
          variant: "destructive",
        });
        navigate('/login');
        setLoading(false);
        return;
      }

      // Update email
      const { error: emailError } = await supabase.functions.invoke('admin-update-email', {
        body: {
          userId: '4e16daf0-a856-4d09-a107-127729e19b46',
          newEmail: 'darciog.orbitha.io@gmail.com'
        }
      });

      if (emailError) {
        console.error('Error updating email:', emailError);
        toast({
          title: "Erro ao atualizar email",
          description: emailError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Update password
      const { error: passwordError } = await supabase.functions.invoke('admin-update-password', {
        body: {
          userId: '4e16daf0-a856-4d09-a107-127729e19b46',
          newPassword: '151708'
        }
      });

      if (passwordError) {
        console.error('Error updating password:', passwordError);
        toast({
          title: "Erro ao atualizar senha",
          description: passwordError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Logout current session
      await supabase.auth.signOut();

      toast({
        title: "Configuração concluída!",
        description: "Email e senha atualizados com sucesso. Faça login com as novas credenciais.",
      });

      navigate('/login');
    } catch (error: any) {
      console.error('Setup error:', error);
      toast({
        title: "Erro na configuração",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuração Inicial do Admin</CardTitle>
          <CardDescription>
            Configure o usuário administrador principal do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Email atual:</strong> darciog@gmail.com
            </p>
            <p className="text-sm">
              <strong>Novo email:</strong> darciog.orbitha.io@gmail.com
            </p>
            <p className="text-sm">
              <strong>Nova senha:</strong> 151708
            </p>
          </div>

          <Button 
            onClick={setupAdmin} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configurando...
              </>
            ) : (
              'Atualizar Credenciais'
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Após a atualização, você será redirecionado para a tela de login onde poderá entrar com as novas credenciais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const AdminSetupPage = () => (
  <AdminGuard>
    <AdminSetup />
  </AdminGuard>
);

export default AdminSetupPage;
