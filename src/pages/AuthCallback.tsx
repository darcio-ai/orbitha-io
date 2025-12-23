import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { syncUserProfile } from "@/services/profile";
import { Loader2 } from "lucide-react";

/**
 * Component to handle OAuth callback and profile completion check.
 * This is mounted on routes where OAuth redirects happen.
 */
const AuthCallback = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session after OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/login", { replace: true });
          return;
        }

        if (!session) {
          // No session, redirect to login
          navigate("/login", { replace: true });
          return;
        }

        // Sync user profile
        await syncUserProfile(session.user);

        // Check if profile is complete
        const { data: profile } = await supabase
          .from("profiles")
          .select("whatsapp, cpf_cnpj")
          .eq("id", session.user.id)
          .single();

        const isProfileIncomplete = !profile?.whatsapp || !profile?.cpf_cnpj;

        // Get intended destination from URL params or default
        const searchParams = new URLSearchParams(location.search);
        const redirectTo = searchParams.get("redirectTo") || "/assistentes";

        if (isProfileIncomplete) {
          // Redirect to complete profile
          navigate("/complete-profile", {
            replace: true,
            state: { from: redirectTo },
          });
          return;
        }

        // Get user role to determine final redirect
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        const isAdmin = rolesData?.some(r => r.role === "admin");
        const defaultPath = isAdmin ? "/dashboard/panel" : "/assistentes";
        const finalPath = redirectTo !== "/dashboard" ? redirectTo : defaultPath;

        navigate(finalPath, { replace: true });
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    handleCallback();
  }, [navigate, location]);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Processando login...</p>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
