import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Crown, Sparkles } from "lucide-react";

interface UpgradePromptProps {
  requiredPlan?: "growth" | "suite";
}

export const UpgradePrompt = ({ requiredPlan }: UpgradePromptProps) => {
  const planName = requiredPlan === "suite" ? "Orbitha Suite" : "Growth Pack";
  
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {requiredPlan === "suite" ? (
              <Sparkles className="h-6 w-6 text-primary" />
            ) : (
              <Crown className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {requiredPlan ? `${planName} Necessário` : "Assinatura Premium Necessária"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {requiredPlan 
              ? `Esta funcionalidade está disponível apenas para assinantes do plano ${planName}.`
              : "Esta funcionalidade está disponível apenas para assinantes premium."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Benefícios da assinatura:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✓ Acesso a todos os agentes inteligentes</li>
              <li>✓ Suporte prioritário</li>
              <li>✓ Atualizações exclusivas</li>
              {requiredPlan === "suite" && (
                <>
                  <li>✓ Funcionalidades avançadas</li>
                  <li>✓ Integrações premium</li>
                </>
              )}
            </ul>
          </div>

          <Button asChild className="w-full">
            <Link to="/pricing">
              Ver Planos e Assinar
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link to="/dashboard/panel">
              Voltar ao Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
