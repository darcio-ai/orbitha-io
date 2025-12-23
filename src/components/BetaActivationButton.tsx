import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { BetaActivationDialog } from "./BetaActivationDialog";

interface BetaActivationButtonProps {
  assistantId: string;
  assistantName: string;
  planType: "life_balance" | "growth" | "suite";
  couponCode: string;
}

export const BetaActivationButton = ({
  assistantId,
  assistantName,
  planType,
  couponCode,
}: BetaActivationButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        className="text-lg border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary"
        onClick={() => setDialogOpen(true)}
      >
        <Gift className="w-5 h-5 mr-2" />
        Ativar Beta Grátis
      </Button>

      <BetaActivationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        assistantId={assistantId}
        assistantName={assistantName}
        planType={planType}
        couponCode={couponCode}
      />
    </>
  );
};
