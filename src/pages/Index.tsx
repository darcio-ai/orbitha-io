import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createStripeCheckout, createAsaasCheckout } from "@/services/payment";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [asaasOpen, setAsaasOpen] = useState(false);
  const [billingInfo, setBillingInfo] = useState({ name: "", email: "", cpfCnpj: "" });

  const handleStripe = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your actual Stripe Price ID
      const { url } = await createStripeCheckout("price_1Qk...");
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to get checkout URL");
      }
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: error.message || "Ocorreu um erro ao iniciar o checkout.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAsaas = async () => {
    if (!billingInfo.name || !billingInfo.email || !billingInfo.cpfCnpj) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { paymentUrl } = await createAsaasCheckout(100, billingInfo); // Value hardcoded for demo
      if (paymentUrl) {
        window.open(paymentUrl, "_blank");
        setAsaasOpen(false);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Plano Pro</CardTitle>
          <CardDescription>Acesso total a todas as funcionalidades do Orbitha AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">R$ 100,00<span className="text-lg font-normal text-muted-foreground">/mês</span></div>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-4">
            <li>IA Ilimitada</li>
            <li>Suporte Prioritário</li>
            <li>Acesso a novas features</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={handleStripe} disabled={loading}>
            {loading ? "Processando..." : "Assinar com Cartão (Stripe)"}
          </Button>

          <Dialog open={asaasOpen} onOpenChange={setAsaasOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Pagar com Pix/Boleto (Asaas)</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dados de Pagamento</DialogTitle>
                <DialogDescription>Informe seus dados para gerar a cobrança no Asaas.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                    placeholder="000.000.000-00"
                    value={billingInfo.cpfCnpj}
                    onChange={e => setBillingInfo({ ...billingInfo, cpfCnpj: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAsaas} disabled={loading}>
                  {loading ? "Gerando..." : "Gerar Pagamento"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
