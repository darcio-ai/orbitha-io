import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createMercadoPagoCheckout, createStripeCheckout, validateCoupon, CouponValidationResult } from "@/services/payment";
import { supabase } from "@/integrations/supabase/client";
import { formatCpfCnpj, validateCpfCnpj } from "@/lib/utils";
import { AlertCircle, Loader2, Tag, Check, X } from "lucide-react";

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
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);

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
      setCouponCode("");
      setCouponResult(null);
    }
  }, [open]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Digite o código do cupom",
        variant: "destructive"
      });
      return;
    }

    setCouponLoading(true);
    try {
      const result = await validateCoupon(couponCode.trim(), planType);
      setCouponResult(result);
      
      if (result.valid) {
        toast({
          title: "Cupom aplicado!",
          description: `Desconto de R$ ${result.discountAmount?.toFixed(2).replace('.', ',')}`,
        });
      } else {
        toast({
          title: "Cupom inválido",
          description: result.error || "Verifique o código digitado",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast({
        title: "Erro ao validar cupom",
        variant: "destructive"
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
  };

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
      const appliedCoupon = couponResult?.valid ? couponCode.trim().toUpperCase() : undefined;
      const { init_point } = await createMercadoPagoCheckout(planType, billingInfo, appliedCoupon);
      
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

  const displayPrice = couponResult?.valid ? couponResult.finalAmount : value;
  const hasDiscount = couponResult?.valid && couponResult.discountAmount && couponResult.discountAmount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assinar Plano</DialogTitle>
          <DialogDescription className="space-y-1">
            <span className="block font-semibold">{planName}</span>
            {hasDiscount ? (
              <span className="block">
                <span className="line-through text-muted-foreground">R$ {value.toFixed(2).replace('.', ',')}</span>
                {' '}
                <span className="text-primary font-bold">R$ {displayPrice?.toFixed(2).replace('.', ',')}/mês</span>
              </span>
            ) : (
              <span className="block">R$ {value.toFixed(2).replace('.', ',')}/mês</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {!showFallback ? (
          <>
            <div className="grid gap-4">
              {/* Coupon Section */}
              <div className="grid gap-2 p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30">
                <Label htmlFor="coupon" className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4" />
                  Cupom de Desconto (opcional)
                </Label>
                
                {couponResult?.valid ? (
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{couponResult.coupon?.code}</span>
                      <span className="text-sm text-muted-foreground">
                        (-{couponResult.coupon?.discountType === 'percentage' 
                          ? `${couponResult.coupon.discountValue}%`
                          : `R$ ${couponResult.coupon?.discountValue.toFixed(2).replace('.', ',')}`
                        })
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRemoveCoupon}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Digite o código"
                      value={couponCode}
                      onChange={e => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponResult(null);
                      }}
                      className="flex-1"
                      maxLength={30}
                    />
                    <Button 
                      variant="secondary" 
                      onClick={handleValidateCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                    >
                      {couponLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Aplicar"
                      )}
                    </Button>
                  </div>
                )}
                
                {couponResult && !couponResult.valid && (
                  <p className="text-sm text-destructive">{couponResult.error}</p>
                )}
              </div>

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
                  hasDiscount 
                    ? `Pagar R$ ${displayPrice?.toFixed(2).replace('.', ',')}/mês`
                    : "Continuar para Pagamento"
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
