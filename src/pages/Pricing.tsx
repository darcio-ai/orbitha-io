import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const handlePlanClick = (planName: string) => {
    alert(`${planName} - Em breve!`);
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
      popular: true
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
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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
