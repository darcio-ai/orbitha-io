import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const isAdmin = rolesData?.some(r => r.role === 'admin');
      
      console.log('🔍 Dashboard.tsx - Is Admin:', isAdmin);
      
      // Users without admin role should not access this page
      if (!isAdmin) {
        console.log('➡️ Dashboard.tsx - User não é admin, redirecionando para /dashboard/agents-for-user');
        navigate("/dashboard/agents-for-user", { replace: true });
      }
    };

    checkAndRedirect();
  }, [navigate]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Painel</h1>
      <p className="text-muted-foreground">Bem-vindo ao painel administrativo.</p>
    </div>
  );
};

export default Dashboard;
