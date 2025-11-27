import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { createAsaasCheckout } from "@/services/payment";
import { supabase } from "@/integrations/supabase/client";
import { formatCpfCnpj, validateCpfCnpj } from "@/lib/utils";

interface AsaasCheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    value: number;
    planName: string;
    planType: string;
}

export function AsaasCheckoutDialog({ open, onOpenChange, value, planName, planType }: AsaasCheckoutDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [billingInfo, setBillingInfo] = useState({ name: "", email: "", cpfCnpj: "" });
    const [billingType, setBillingType] = useState("BOLETO");
    const [cpfCnpjError, setCpfCnpjError] = useState(false);

    // Pré-preencher dados quando o dialog abrir
    useEffect(() => {
        if (open) {
            const fetchUserData = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("billing_name, cpf_cnpj, email")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setBillingInfo({
                        name: profile.billing_name || "",
                        email: profile.email || "",
                        cpfCnpj: profile.cpf_cnpj || "",
                    });
                }
            };

            fetchUserData();
        }
    }, [open]);

    const handleAsaas = async () => {
        if (!billingInfo.name || !billingInfo.email || !billingInfo.cpfCnpj) {
            toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
            return;
        }

        if (!validateCpfCnpj(billingInfo.cpfCnpj)) {
            setCpfCnpjError(true);
            toast({ title: "CPF/CNPJ inválido", description: "Verifique o documento digitado.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const { url } = await createAsaasCheckout(planType as 'growth' | 'suite', billingInfo, billingType);
            if (url) {
                window.open(url, "_blank");
                onOpenChange(false);
                toast({ title: "Sucesso", description: "Fatura gerada com sucesso! Verifique a nova aba." });
            } else {
                throw new Error("Failed to get payment URL");
            }
        } catch (error) {
            toast({
                title: "Erro no pagamento",
                description: error.message || "Ocorreu um erro ao gerar a cobrança.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pagamento via Pix ou Boleto</DialogTitle>
                    <DialogDescription>
                        Para o plano: <strong>{planName}</strong> (R$ {value.toFixed(2)})
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Método de Pagamento</Label>
                        <RadioGroup value={billingType} onValueChange={setBillingType}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="BOLETO" id="boleto" />
                                <Label htmlFor="boleto" className="cursor-pointer">Boleto Bancário</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="PIX" id="pix" />
                                <Label htmlFor="pix" className="cursor-pointer">PIX (requer conta aprovada)</Label>
                            </div>
                        </RadioGroup>
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
                        <Label htmlFor="cpf">CPF/CNPJ</Label>
                        <Input
                            id="cpf"
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
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
                    <Button onClick={handleAsaas} disabled={loading}>
                        {loading ? "Gerando..." : "Gerar Pagamento"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
