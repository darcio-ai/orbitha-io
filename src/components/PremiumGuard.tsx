import { ReactNode } from "react";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { UpgradePrompt } from "./UpgradePrompt";

interface PremiumGuardProps {
  children: ReactNode;
  requiredPlan?: "growth" | "suite";
  fallback?: ReactNode;
}

export const PremiumGuard = ({ children, requiredPlan, fallback }: PremiumGuardProps) => {
  const { isActive, planType, isLoading } = useUserSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não tem assinatura ativa
  if (!isActive) {
    return fallback || <UpgradePrompt />;
  }

  // Se requer um plano específico
  if (requiredPlan && planType !== requiredPlan) {
    return fallback || <UpgradePrompt requiredPlan={requiredPlan} />;
  }

  return <>{children}</>;
};
