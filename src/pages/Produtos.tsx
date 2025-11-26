import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ASSISTANT_DEMOS } from "@/config/assistantDemos";
import { Check } from "lucide-react";

import agenteFinanceiro from "@/assets/agente_financeiro.png";
import agenteBusiness from "@/assets/agente_business.png";
import agenteFitness from "@/assets/agente_fitness.png";
import agenteVendas from "@/assets/agente_vendas.png";
import agenteViagens from "@/assets/agente_viagens.png";
import agenteMarketing from "@/assets/agente_marketing.png";
import agenteSuporte from "@/assets/agente_suporte.png";

const Produtos = () => {
  const navigate = useNavigate();

  const produtos = [
    {
      title: "Financial Assistant",
      image: agenteFinanceiro,
      description:
        "Transforme sua relação com o dinheiro: organize finanças, invista com inteligência e conquiste seus objetivos financeiros.",
      link: "/assistentes/financial-assistant",
      demoId: "financeiro",
    },
    {
      title: "Business Assistant",
      image: agenteBusiness,
      description:
        "IA para MEI e pequenos negócios: PF x PJ, fluxo de caixa, precificação, margem e checklists de obrigações — com plano de ação claro.",
      link: "/assistentes/business-assistant",
      demoId: "business",
    },
    {
      title: "Sales Assistant",
      image: agenteVendas,
      description:
        "Venda mais, venda melhor: domine metodologias, CRMs, KPIs e estratégias que transformam vendedores comuns em top performers.",
      link: "/assistentes/sales-assistant",
      demoId: "vendas",
    },
    {
      title: "Marketing Assistant",
      image: agenteMarketing,
      description:
        "Seu estrategista de marketing 24/7 para MEI/PJ: entende seu negócio, organiza ICP e funil, e entrega uma rotina simples com calendário de conteúdo, anúncios e copies sob medida para atrair e converter mais clientes.",
      link: "/assistentes/marketing-assistant",
      demoId: "marketing",
    },
    {
      title: "Support Assistant",
      image: agenteSuporte,
      description:
        "Atendimento excepcional: processos, métricas e automação para encantar clientes e otimizar seu suporte.",
      link: "/assistentes/support-assistant",
      demoId: "suporte",
    },
    {
      title: "Travel Assistant",
      image: agenteViagens,
      description:
        "Planeje viagens incríveis com um especialista que conhece destinos, roteiros, dicas e transforma sonhos em itinerários reais.",
      link: "/assistentes/travel-assistant",
      demoId: "viagens",
    },
    {
      title: "Fitness Assistant",
      image: agenteFitness,
      description:
        "Alcance seus objetivos fitness com um guia completo que domina treinos, nutrição, recuperação e as últimas tendências.",
      link: "/assistentes/fitness-assistant",
      demoId: "fitness",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 md:pb-16">
      {/* Hero Section */}
      <section className="py-8 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-16">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Nossos <span className="text-primary">Assistentes</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground">
              Assistentes de IA especializados para transformar seu negócio
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
            {produtos.map((produto, index) => {
              const assistantConfig = produto.demoId ? ASSISTANT_DEMOS[produto.demoId] : null;
              const planFocus = assistantConfig?.planFocus || "suite";

              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl min-h-[280px] md:min-h-[340px] bg-white/5 flex items-center justify-center"
                >
                  <Link to={produto.link} className="block">
                    <img
                      src={produto.image}
                      alt={produto.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6 md:pb-8 px-4 md:px-6">
                    <div className="text-center mb-3 md:mb-4">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">{produto.title}</h3>
                      <p className="text-muted-foreground text-xs md:text-sm">{produto.description}</p>
                    </div>

                    <div className="flex flex-col w-full gap-2 max-w-md">
                      {produto.demoId && (
                        <Button
                          size="lg"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/demo/${produto.demoId}`);
                          }}
                          className="w-full"
                        >
                          Testar demo rápida
                        </Button>
                      )}

                      <Button
                        size="lg"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/planos?focus=${planFocus}`);
                        }}
                        className="w-full"
                      >
                        Ver planos
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider suave */}
          <div className="max-w-6xl mx-auto mt-8 md:mt-12 mb-4 md:mb-6 h-px bg-white/10" />

          {/* Pacotes / Combos */}
          <section className="max-w-6xl mx-auto mt-4 md:mt-6 px-2">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Quer destravar tudo de uma vez?</h2>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground mt-2">
                Escolha um pacote e tenha acesso completo com 7 dias de garantia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
              {/* Growth Pack */}
              <Card className="relative flex flex-col border-border">
                <CardHeader className="text-center pb-6 md:pb-8 pt-6 md:pt-8">
                  <CardTitle className="text-xl md:text-2xl mb-2">Growth Pack</CardTitle>
                  <p className="text-xs md:text-sm font-medium text-primary mb-2">Pra vender mais e atender melhor</p>
                  <CardDescription className="text-sm md:text-base">Ideal para vendas, marketing e suporte</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl md:text-4xl font-bold text-foreground">R$ 97,00</span>
                    <span className="text-sm md:text-base text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow px-4 md:px-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">Sales Assistant completo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">Marketing Assistant completo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">Support Assistant completo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">Conversas ilimitadas</span>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter className="flex-col gap-3 px-4 md:px-6">
                  <Button
                    className="w-full"
                    variant="default"
                    size="lg"
                    onClick={() => navigate("/planos?focus=growth")}
                  >
                    Pagar com Cartão
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/planos?focus=growth")}
                  >
                    Pagar com Pix
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    ✅ 7 dias de garantia incondicional<br />
                    ✅ Cancele quando quiser
                  </p>
                </CardFooter>
              </Card>

              {/* Orbitha Suite */}
              <Card className="relative flex flex-col border-border">
                <CardHeader className="text-center pb-6 md:pb-8 pt-6 md:pt-8">
                  <CardTitle className="text-xl md:text-2xl mb-2">Orbitha Suite</CardTitle>
                  <p className="text-xs md:text-sm font-medium text-primary mb-2">Negócio + vida pessoal</p>
                  <CardDescription className="text-sm md:text-base">Todos os 7 assistentes + recursos premium</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl md:text-4xl font-bold text-foreground">R$ 147,00</span>
                    <span className="text-sm md:text-base text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow px-4 md:px-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">Todos os assistentes (7)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">Financial, Business, Fitness, Travel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">Sales, Marketing, Support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-foreground">Suporte prioritário</span>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter className="flex-col gap-3 px-4 md:px-6">
                  <Button
                    className="w-full"
                    variant="default"
                    size="lg"
                    onClick={() => navigate("/planos?focus=suite")}
                  >
                    Pagar com Cartão
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/planos?focus=suite")}
                  >
                    Pagar com Pix
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    ✅ 7 dias de garantia incondicional<br />
                    ✅ Cancele quando quiser
                  </p>
                </CardFooter>
              </Card>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Produtos;
