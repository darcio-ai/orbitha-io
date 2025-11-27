import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserSubscription {
  subscription_status: string | null;
  subscription_plan: string | null;
  subscription_end_date: string | null;
  stripe_customer_id: string | null;
}

export const useUserSubscription = () => {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_plan, subscription_end_date, stripe_customer_id")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching subscription:", error);
        return null;
      }

      return data as UserSubscription;
    },
  });

  const isActive = subscription?.subscription_status === "active";
  const planType = subscription?.subscription_plan;

  return {
    subscription,
    isActive,
    planType,
    isLoading,
  };
};
