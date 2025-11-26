import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createStripeCheckout } from "@/services/payment";
import { AsaasCheckoutDialog } from "@/components/AsaasCheckoutDialog";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loadingStripe, setLoadingStripe] = useState(false);

  // Asaas Dialog State
  const [asaasOpen, setAsaasOpen] = useState(false);
  const [selectedPlanForAsaas, setSelectedPlanForAsaas] = useState<{ name: string, value: number } | null>(null);

  const focusPlan = searchParams.get('focus'); // 'suite' ou 'growth'

  useEffect(() => {
    document.title = "Planos | Financial Assistant Premium";
    // ... (meta tags logic kept same)

    // Verificar se usuário está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // Removed MercadoPago initialization

  const handleStripeCheckout = async (priceId: string) => {
    if (!user) {
      toast({ title: "Login necessário", description: "Faça login para assinar.", variant: "default" });
      navigate("/login");
      return;
    }
    setLoadingStripe(true);
    try {
      console.log('Starting Stripe checkout for price:', priceId);
      const { url } = await createStripeCheckout(priceId);
      console.log('Redirecting to Stripe checkout:', url);
      
      if (url) {
        // Use a short delay to ensure state is updated before redirect
        setTimeout(() => {
          window.location.href = url;
        }, 100);
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (error: any) {
      console.error('Stripe checkout failed:', error);
      toast({ 
        title: "Erro no checkout", 
        description: error.message || "Erro ao processar pagamento. Tente novamente.", 
        variant: "destructive" 
      });
      setLoadingStripe(false);
    }
  };

  const handleAsaasClick = (plan: any) => {
    if (!user) {
      toast({ title: "Login necessário", description: "Faça login para assinar.", variant: "default" });
      navigate("/login");
      return;
    }
    // Extract numeric value from string "R$ 00,00" (simplified for demo)
    // In real app, store price in number in the plan object
    const value = plan.priceValue;
    setSelectedPlanForAsaas({ name: plan.name, value });
    setAsaasOpen(true);
  };

  const plans = [
    {
      name: "Growth Pack",
      price: "R$ 97,00",
      priceValue: 97.00,
      stripePriceId: "price_1SXZ8cJVqrOuT3N7Frp0xJbv",
      period: "/mês",
      subtitle: "Pra vender mais e atender melhor",
      description: "Ideal para vendas, marketing e suporte",
      microcopy: "Combo de negócios (3 assistentes).",
      valueAnchor: "Mais barato do que contratar cada área separada.",
      features: [
        "Sales Assistant completo",
        "Marketing Assistant completo",
        "Support Assistant completo",
        "Conversas ilimitadas"
      ],
      buttonText: "Assinar Growth Pack",
      buttonVariant: "default" as const,
      popular: focusPlan === 'growth',
      planType: 'growth'
    },
    {
      name: "Orbitha Suite",
      price: "R$ 147,00",
      priceValue: 147.00,
      stripePriceId: "price_1SXZ9FJVqrOuT3N73PzMG5ca",
      period: "/mês",
      subtitle: "Negócio + vida pessoal",
      description: "Todos os 7 assistentes + recursos premium",
      microcopy: "Todos os assistentes (7) liberados.",
      valueAnchor: "Preço único para acesso total.",
      features: [
        "Todos os assistentes (7)",
        "Financial, Business, Fitness, Travel",
        "Sales, Marketing, Support",
        "Suporte prioritário"
      ],
      buttonText: "Assinar Orbitha Suite",
      buttonVariant: "default" as const,
      popular: focusPlan === 'suite',
      planType: 'suite'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Destrave seus assistentes da Orbitha
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A demo foi só o começo. Agora destrave o acesso completo.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
                }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  RECOMENDADO
                </Badge>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <p className="text-sm font-medium text-primary mb-2">{plan.subtitle}</p>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex-col gap-3">
                <Button
                  className="w-full"
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={() => handleStripeCheckout(plan.stripePriceId)}
                  disabled={loadingStripe}
                >
                  {loadingStripe ? "Processando..." : "Pagar com Cartão"}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  onClick={() => handleAsaasClick(plan)}
                >
                  Pagar com Pix
                </Button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  ✅ 7 dias de garantia incondicional<br />
                  ✅ Cancele quando quiser
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        {/* ... (FAQ kept same) ... */}

      </div>

      {selectedPlanForAsaas && (
        <AsaasCheckoutDialog
          open={asaasOpen}
          onOpenChange={setAsaasOpen}
          value={selectedPlanForAsaas.value}
          planName={selectedPlanForAsaas.name}
        />
      )}
    </div>
  );
};

export default Pricing;
