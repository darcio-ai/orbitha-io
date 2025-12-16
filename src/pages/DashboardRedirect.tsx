import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }

        // Buscar role e perfil em paralelo
        const [rolesResult, profileResult] = await Promise.all([
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id),
          supabase
            .from("profiles")
            .select("subscription_status")
            .eq("id", session.user.id)
            .single()
        ]);

        const isAdmin = rolesResult.data?.some(r => r.role === 'admin');
        const hasActiveSubscription = profileResult.data?.subscription_status === 'active';
        
        if (isAdmin) {
          // Admin vai para o painel principal
          navigate("/dashboard/panel", { replace: true });
        } else if (hasActiveSubscription) {
          // Usuário com assinatura ativa vai para assistentes
          navigate("/dashboard/agents-for-user", { replace: true });
        } else {
          // Usuário sem assinatura vai para página de preços
          navigate("/pricing", { replace: true });
        }
      } catch (error) {
        console.error("Error checking role:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    redirectBasedOnRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
};

export default DashboardRedirect;
