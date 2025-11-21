import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);

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
    
    if (planName === "Gratuito") {
      console.log('Redirecionando para cadastro...');
      navigate("/cadastro-gratuito");
    }
    // Premium e Enterprise são tratados pelo MercadoPago via IDs dos botões
  };

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Para começar a entender seu score",
      features: [
        "Score Básico 0-100",
        "3 consultas/mês",
        "Acesso limitado"
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Premium",
      price: "R$ 29,90",
      period: "/mês",
      description: "Ideal para acompanhamento completo",
      features: [
        "Score Detalhado (5 pilares)",
        "Conversas ilimitadas",
        "Produtos específicos",
        "Planos de ação personalizados"
      ],
      buttonText: "Assinar Premium",
      buttonVariant: "default" as const,
      popular: true,
      buttonId: "btn-premium"
    },
    {
      name: "Enterprise",
      price: "R$ 97",
      period: "/mês",
      description: "Para máximo controle financeiro",
      features: [
        "Tudo do Premium +",
        "Relatórios de evolução",
        "Simulações de aposentadoria",
        "Suporte prioritário"
      ],
      buttonText: "Assinar Enterprise",
      buttonVariant: "outline" as const,
      popular: false,
      buttonId: "btn-enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Escolha o Plano Ideal Para Você
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesse funcionalidades exclusivas do Score Patrimonial
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                  MAIS POPULAR
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
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

              <CardFooter>
                <Button 
                  className="w-full"
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={() => handlePlanClick(plan.name)}
                  id={(plan as any).buttonId}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
