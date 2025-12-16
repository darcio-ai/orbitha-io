import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createAsaasCheckout, createStripeCheckout } from "@/services/payment";
import { supabase } from "@/integrations/supabase/client";
import { formatCpfCnpj, validateCpfCnpj, formatPhone } from "@/lib/utils";
import { CreditCard, QrCode, AlertCircle } from "lucide-react";

interface AsaasCheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    value: number;
    planName: string;
    planType: 'growth' | 'suite' | 'life_balance';
}

type PaymentMethod = 'PIX' | 'CREDIT_CARD';

export function AsaasCheckoutDialog({ open, onOpenChange, value, planName, planType }: AsaasCheckoutDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [billingInfo, setBillingInfo] = useState({ name: "", email: "", cpfCnpj: "", cellphone: "" });
    const [cpfCnpjError, setCpfCnpjError] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
    const [showFallback, setShowFallback] = useState(false);

    // Pré-preencher dados quando o dialog abrir
    useEffect(() => {
        if (open) {
            const fetchUserData = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("billing_name, cpf_cnpj, email, phone, whatsapp")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setBillingInfo({
                        name: profile.billing_name || "",
                        email: profile.email || "",
                        cpfCnpj: profile.cpf_cnpj || "",
                        cellphone: profile.phone || profile.whatsapp || "",
                    });
                }
            };

            fetchUserData();
            setShowFallback(false);
        }
    }, [open]);

    const validateForm = () => {
        if (!billingInfo.name || !billingInfo.email || !billingInfo.cpfCnpj || !billingInfo.cellphone) {
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
            const { url } = await createAsaasCheckout(planType, billingInfo, paymentMethod);
            if (url) {
                window.location.href = url;
            } else {
                throw new Error("Falha ao gerar URL de pagamento");
            }
        } catch (error: any) {
            console.error('Asaas checkout error:', error);
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
                    <DialogTitle>Finalizar Pagamento</DialogTitle>
                    <DialogDescription>
                        <strong>{planName}</strong> — R$ {value.toFixed(2).replace('.', ',')}/mês
                    </DialogDescription>
                </DialogHeader>

                {!showFallback ? (
                    <>
                        {/* Seletor de método de pagamento */}
                        <div className="flex gap-2 mb-4">
                            <Button
                                type="button"
                                variant={paymentMethod === 'PIX' ? 'default' : 'outline'}
                                className="flex-1 gap-2"
                                onClick={() => setPaymentMethod('PIX')}
                            >
                                <QrCode className="h-4 w-4" />
                                PIX
                            </Button>
                            <Button
                                type="button"
                                variant={paymentMethod === 'CREDIT_CARD' ? 'default' : 'outline'}
                                className="flex-1 gap-2"
                                onClick={() => setPaymentMethod('CREDIT_CARD')}
                            >
                                <CreditCard className="h-4 w-4" />
                                Cartão
                            </Button>
                        </div>

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
                                <Label htmlFor="cellphone">Celular *</Label>
                                <Input
                                    id="cellphone"
                                    placeholder="(11) 99999-9999"
                                    value={billingInfo.cellphone}
                                    onChange={e => setBillingInfo({ ...billingInfo, cellphone: formatPhone(e.target.value) })}
                                    maxLength={15}
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

                        <DialogFooter className="mt-4">
                            <Button onClick={handlePayment} disabled={loading} className="w-full">
                                {loading ? "Processando..." : `Pagar com ${paymentMethod === 'PIX' ? 'PIX' : 'Cartão'}`}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-sm">Houve um problema com o pagamento principal.</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Use o pagamento alternativo via Stripe (aceita cartões internacionais):
                        </p>
                        <Button onClick={handleStripeFallback} disabled={loading} className="w-full">
                            {loading ? "Processando..." : "Pagar com Stripe"}
                        </Button>
                        <Button variant="ghost" onClick={() => setShowFallback(false)} className="w-full">
                            Tentar novamente
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
