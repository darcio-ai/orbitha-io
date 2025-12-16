import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createAbacatePayCheckout, createStripeCheckout, createAsaasCheckout } from "@/services/payment";
import { supabase } from "@/integrations/supabase/client";
import { formatCpfCnpj, validateCpfCnpj } from "@/lib/utils";
import { CreditCard, QrCode, AlertCircle } from "lucide-react";

interface AbacatePayCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: number;
  planName: string;
  planType: 'growth' | 'suite' | 'life_balance';
}

type PaymentMethod = 'PIX' | 'CARD';

export function AbacatePayCheckoutDialog({ open, onOpenChange, value, planName, planType }: AbacatePayCheckoutDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState({ name: "", email: "", cpfCnpj: "", cellphone: "" });
  const [cpfCnpjError, setCpfCnpjError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (open) {
      setShowFallback(false);
      const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("billing_name, cpf_cnpj, email, whatsapp, phone")
          .eq("id", user.id)
          .single();

        if (profile) {
          setBillingInfo({
            name: profile.billing_name || "",
            email: profile.email || "",
            cpfCnpj: profile.cpf_cnpj || "",
            cellphone: profile.whatsapp || profile.phone || "",
          });
        }
      };

      fetchUserData();
    }
  }, [open]);

  const validateForm = () => {
    if (!billingInfo.name || !billingInfo.email || !billingInfo.cpfCnpj) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
      return false;
    }

    if (!validateCpfCnpj(billingInfo.cpfCnpj)) {
      setCpfCnpjError(true);
      toast({ title: "CPF/CNPJ inválido", description: "Verifique o documento digitado.", variant: "destructive" });
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (paymentMethod === 'PIX') {
        // PIX via Abacate Pay
        const { url } = await createAbacatePayCheckout(planType, billingInfo, 'PIX');
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("Não foi possível gerar o link de pagamento");
        }
      } else {
        // Cartão via Asaas diretamente
        const { url } = await createAsaasCheckout(planType, billingInfo, 'CREDIT_CARD');
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("Não foi possível gerar o link de pagamento");
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setShowFallback(true);
      toast({
        title: "Erro no processamento",
        description: "Escolha outro método de pagamento abaixo.",
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
      if (url) window.location.href = url;
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar pagamento</DialogTitle>
          <DialogDescription>
            Plano: <strong>{planName}</strong> — R$ {value.toFixed(2)}/mês
          </DialogDescription>
        </DialogHeader>

        {!showFallback ? (
          <>
            <div className="grid gap-4 py-4">
              {/* Payment Method Selector */}
              <div className="grid gap-2">
                <Label>Método de pagamento</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'PIX' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPaymentMethod('PIX')}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    PIX
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'CARD' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPaymentMethod('CARD')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Cartão
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={billingInfo.name}
                  onChange={e => setBillingInfo({ ...billingInfo, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={billingInfo.email}
                  onChange={e => setBillingInfo({ ...billingInfo, email: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cellphone">Celular</Label>
                <Input
                  id="cellphone"
                  placeholder="(11) 99999-9999"
                  value={billingInfo.cellphone}
                  onChange={e => setBillingInfo({ ...billingInfo, cellphone: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF/CNPJ</Label>
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

            <DialogFooter>
              <Button onClick={handlePayment} disabled={loading} className="w-full">
                {loading ? "Processando..." : `Pagar com ${paymentMethod === 'PIX' ? 'PIX' : 'Cartão'}`}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Ocorreu um erro. Escolha outro método:</p>
            </div>

            <div className="grid gap-3">
              <Button
                variant="outline"
                onClick={handleStripeFallback}
                disabled={loading}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {loading ? 'Redirecionando...' : 'Cartão Internacional (Stripe)'}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowFallback(false)}
                className="w-full"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
