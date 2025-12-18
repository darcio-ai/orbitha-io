import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createMercadoPagoCheckout, createStripeCheckout } from "@/services/payment";
import { supabase } from "@/integrations/supabase/client";
import { formatCpfCnpj, validateCpfCnpj } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";

interface MercadoPagoCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: number;
  planName: string;
  planType: 'growth' | 'suite' | 'life_balance';
}

export function MercadoPagoCheckoutDialog({ 
  open, 
  onOpenChange, 
  value, 
  planName, 
  planType 
}: MercadoPagoCheckoutDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState({ name: "", email: "", cpfCnpj: "" });
  const [cpfCnpjError, setCpfCnpjError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Pré-preencher dados quando o dialog abrir
  useEffect(() => {
    if (open) {
      const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("billing_name, cpf_cnpj, email, firstname, lastname")
          .eq("id", user.id)
          .single();

        if (profile) {
          setBillingInfo({
            name: profile.billing_name || `${profile.firstname} ${profile.lastname}`.trim() || "",
            email: profile.email || "",
            cpfCnpj: profile.cpf_cnpj || "",
          });
        }
      };

      fetchUserData();
      setShowFallback(false);
    }
  }, [open]);

  const validateForm = () => {
    if (!billingInfo.name || !billingInfo.email || !billingInfo.cpfCnpj) {
      toast({ 
        title: "Campos obrigatórios", 
        description: "Preencha todos os campos.", 
        variant: "destructive" 
      });
      return false;
    }

    if (!validateCpfCnpj(billingInfo.cpfCnpj)) {
      setCpfCnpjError(true);
      toast({ 
        title: "CPF/CNPJ inválido", 
        description: "Verifique o documento digitado.", 
        variant: "destructive" 
      });
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { init_point } = await createMercadoPagoCheckout(planType, billingInfo);
      
      if (init_point) {
        window.location.href = init_point;
      } else {
        throw new Error("Falha ao gerar URL de pagamento");
      }
    } catch (error: any) {
      console.error('Mercado Pago checkout error:', error);
      setShowFallback(true);
      toast({
        title: "Erro no pagamento",
        description: "Tente novamente ou use o pagamento alternativo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStripeFallback = async () => {
    setLoading(true);
    try {
      const { url } = await createStripeCheckout(planType);
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      toast({
        title: "Erro no pagamento",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assinar Plano</DialogTitle>
          <DialogDescription>
            <strong>{planName}</strong> — R$ {value.toFixed(2).replace('.', ',')}/mês
          </DialogDescription>
        </DialogHeader>

        {!showFallback ? (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={billingInfo.name}
                  onChange={e => setBillingInfo({ ...billingInfo, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={billingInfo.email}
                  onChange={e => setBillingInfo({ ...billingInfo, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF/CNPJ *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={billingInfo.cpfCnpj}
                  onChange={e => {
                    const formatted = formatCpfCnpj(e.target.value);
                    setBillingInfo({ ...billingInfo, cpfCnpj: formatted });
                    setCpfCnpjError(false);
                  }}
                  className={cpfCnpjError ? "border-destructive" : ""}
                  maxLength={18}
                />
                {cpfCnpjError && (
                  <p className="text-sm text-destructive">CPF/CNPJ inválido</p>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Você será redirecionado para o Mercado Pago para concluir o pagamento com segurança.
            </p>

            <DialogFooter className="mt-4">
              <Button 
                onClick={handlePayment} 
                disabled={loading} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Continuar para Pagamento"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">Houve um problema com o Mercado Pago.</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Use o pagamento alternativo via Stripe (aceita cartões internacionais):
            </p>
            <Button 
              onClick={handleStripeFallback} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Pagar com Stripe"
              )}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowFallback(false)} 
              className="w-full"
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
