import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ASSISTANT_DEMOS } from "@/config/assistantDemos";
import agenteFinanceiro from "@/assets/agente_financeiro.png";
import agenteBusiness from "@/assets/agente_business.png";
import agenteFitness from "@/assets/agente_fitness.png";
import agenteVendas from "@/assets/agente_vendas.png";
import agenteViagens from "@/assets/agente_viagens.png";
import agenteMarketing from "@/assets/agente_marketing.png";
import agenteSuporte from "@/assets/agente_suporte.png";
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
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nossos <span className="text-primary">Assistentes</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Assistentes de IA especializados para transformar seu negócio
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {produtos.map((produto, index) => {
              const assistantConfig = produto.demoId ? ASSISTANT_DEMOS[produto.demoId] : null;
              const planFocus = assistantConfig?.planFocus || "suite";

              return (
                <div key={index} className="group relative overflow-hidden rounded-2xl">
                  <Link to={produto.link} className="block">
                    <img
                      src={produto.image}
                      alt={produto.title}
                      className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-8 px-6">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold mb-2">{produto.title}</h3>
                      <p className="text-muted-foreground text-sm">{produto.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                      {produto.demoId && (
                        <Button
                          size="lg"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/demo/${produto.demoId}`);
                          }}
                          className="flex-1"
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
                        className="flex-1"
                      >
                        Ver planos
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pacotes / Combos */}
          <section className="max-w-6xl mx-auto mt-14 px-2">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Quer destravar tudo de uma vez?</h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Escolha um pacote e tenha acesso completo com 7 dias de garantia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Growth Pack */}
              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-primary/40 via-white/10 to-transparent">
                <div className="rounded-2xl bg-background/80 p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                      Para crescer mais rápido
                    </span>
                  </div>

                  {/* Placeholder visual sem imagem */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
                    <p className="text-sm text-muted-foreground">Vendas • Marketing • Suporte</p>
                  </div>

                  <h3 className="text-xl font-semibold mb-1">Growth Pack</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    O combo ideal pra quem quer vender mais e atender melhor.
                  </p>

                  <ul className="text-sm space-y-2 mb-6">
                    <li>• Sales Assistant completo</li>
                    <li>• Marketing Assistant completo</li>
                    <li>• Support Assistant completo</li>
                  </ul>

                  <div className="mt-auto">
                    <Button size="lg" onClick={() => navigate("/planos?focus=growth")} className="w-full">
                      Assinar Growth Pack
                    </Button>
                  </div>
                </div>
              </div>

              {/* Orbitha Suite */}
              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-white/30 via-primary/10 to-transparent">
                <div className="rounded-2xl bg-background/80 p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10">Acesso total</span>
                  </div>

                  {/* Placeholder visual sem imagem */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
                    <p className="text-sm text-muted-foreground">Todos os 7 assistentes</p>
                  </div>

                  <h3 className="text-xl font-semibold mb-1">Orbitha Suite</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Produtividade + Growth. Tudo que a Orbitha oferece.
                  </p>

                  <ul className="text-sm space-y-2 mb-6">
                    <li>• 7 assistentes completos</li>
                    <li>• Recursos premium</li>
                    <li>• Suporte prioritário</li>
                  </ul>

                  <div className="mt-auto">
                    <Button size="lg" onClick={() => navigate("/planos?focus=suite")} className="w-full">
                      Assinar Orbitha Suite
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Produtos;
