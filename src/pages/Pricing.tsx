import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  
  const focusPlan = searchParams.get('focus'); // 'suite' ou 'growth'

  useEffect(() => {
    document.title = "Planos | Financial Assistant Premium";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Score Patrimonial 0-100. Planos Premium e Enterprise com conversas ilimitadas, produtos específicos e suporte prioritário.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Score Patrimonial 0-100. Planos Premium e Enterprise com conversas ilimitadas, produtos específicos e suporte prioritário.";
      document.head.appendChild(meta);
    }

    // Verificar se usuário está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    // Inicializar MercadoPago após o componente montar
    const initMercadoPago = () => {
      const PUBLIC_KEY = "TEST-c639b934-1134-4a25-8ed4-7912b5cea5c2";
      const PREF_PREMIUM = "94896762-701fde35-114d-4505-b991-a067eb0bf85b";
      const PREF_ENTERPRISE = "94896762-8076e775-0b16-412f-a12c-6b821c3eb177";

      if (typeof window !== 'undefined' && (window as any).MercadoPago) {
        const mp = new (window as any).MercadoPago(PUBLIC_KEY, { locale: "pt-BR" });

        const btnPremium = document.getElementById("btn-premium");
        if (btnPremium) {
          btnPremium.addEventListener("click", () => {
            mp.checkout({
              preference: { id: PREF_PREMIUM },
              autoOpen: true
            });
          });
        }

        const btnEnterprise = document.getElementById("btn-enterprise");
        if (btnEnterprise) {
          btnEnterprise.addEventListener("click", () => {
            mp.checkout({
              preference: { id: PREF_ENTERPRISE },
              autoOpen: true
            });
          });
        }
      }
    };

    // Aguardar o SDK do MercadoPago carregar
    const checkMercadoPago = setInterval(() => {
      if ((window as any).MercadoPago) {
        initMercadoPago();
        clearInterval(checkMercadoPago);
      }
    }, 100);

    return () => clearInterval(checkMercadoPago);
  }, []);

  const handlePlanClick = (planName: string) => {
    console.log('Plano clicado:', planName);
    // Growth Pack e Orbitha Suite são tratados pelo MercadoPago via IDs dos botões
  };

  const plans = [
    {
      name: "Growth Pack",
      price: "R$ 29,90",
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
      buttonText: "Continuar com Growth Pack",
      buttonVariant: "default" as const,
      popular: focusPlan === 'growth',
      buttonId: "btn-premium",
      planType: 'growth'
    },
    {
      name: "Orbitha Suite",
      price: "R$ 97",
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
      buttonText: "Destravar Orbitha Suite",
      buttonVariant: "default" as const,
      popular: focusPlan === 'suite',
      buttonId: "btn-enterprise",
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
            Você já testou a demo. Agora tenha acesso completo com 7 dias de garantia.
          </p>
          {focusPlan && (
            <p className="text-lg text-primary mt-4 font-semibold">
              Plano recomendado para o assistente que você acabou de testar.
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular 
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
                <p className="text-sm font-medium text-primary mb-2">{(plan as any).subtitle}</p>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <p className="text-sm text-muted-foreground mt-2">{(plan as any).microcopy}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-primary mt-2 font-medium">{(plan as any).valueAnchor}</p>
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

              <CardFooter className="flex-col">
                <Button 
                  className="w-full"
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={() => handlePlanClick(plan.name)}
                  id={(plan as any).buttonId}
                >
                  {plan.buttonText}
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
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                O que muda do demo para o plano completo?
              </h3>
              <p className="text-muted-foreground">
                No demo você tem acesso limitado a poucos testes. Com o plano, você tem conversas ilimitadas e acesso completo a todos os recursos dos assistentes incluídos no combo escolhido.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Como funciona a garantia de 7 dias?
              </h3>
              <p className="text-muted-foreground">
                Você tem 7 dias após a assinatura para testar tudo. Se não gostar por qualquer motivo, devolvemos 100% do valor investido, sem perguntas.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Posso cancelar quando quiser?
              </h3>
              <p className="text-muted-foreground">
                Sim! Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento direto na sua conta, sem burocracia.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Quais assistentes estão em cada combo?
              </h3>
              <p className="text-muted-foreground">
                <strong>Growth Pack:</strong> Sales Assistant, Marketing Assistant e Support Assistant (foco em negócios).<br />
                <strong>Orbitha Suite:</strong> Todos os 7 assistentes - Financial, Business, Fitness, Travel, Sales, Marketing e Support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
