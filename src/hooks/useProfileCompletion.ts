import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { syncUserProfile } from "@/services/profile";

/**
 * Hook to check if user profile is complete and redirect accordingly.
 * Should be used on pages that require profile completion.
 */
export const useProfileCompletion = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsChecking(false);
          return;
        }

        // Sync profile first
        await syncUserProfile(session.user);

        // Check if profile is complete
        const { data: profile } = await supabase
          .from("profiles")
          .select("whatsapp, cpf_cnpj")
          .eq("id", session.user.id)
          .single();

        const isProfileComplete = !!(profile?.whatsapp && profile?.cpf_cnpj);
        setIsComplete(isProfileComplete);

        if (!isProfileComplete) {
          // Redirect to complete profile with current path as destination
          navigate("/complete-profile", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [navigate, location.pathname]);

  return { isChecking, isComplete };
};

/**
 * Check profile completion without navigation.
 * Useful for one-time checks.
 */
export const checkProfileCompletion = async (userId: string): Promise<boolean> => {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("whatsapp, cpf_cnpj")
      .eq("id", userId)
      .single();

    return !!(profile?.whatsapp && profile?.cpf_cnpj);
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
};
