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

        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        const isAdmin = rolesData?.some(r => r.role === 'admin');
        
        if (isAdmin) {
          // Admin vai para o painel principal
          navigate("/dashboard/panel", { replace: true });
        } else {
          // User vai para página pública de assistentes
          navigate("/assistentes", { replace: true });
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
