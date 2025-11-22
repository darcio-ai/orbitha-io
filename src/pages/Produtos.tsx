import { Link } from "react-router-dom";
import agenteFinanceiro from "@/assets/agente_financeiro.png";
import agenteBusiness from "@/assets/agente_business.png";
import agenteFitness from "@/assets/agente_fitness.png";
import agenteVendas from "@/assets/agente_vendas.png";
import agenteViagens from "@/assets/agente_viagens.png";
import agenteMarketing from "@/assets/agente_marketing.png";
import agenteSuporte from "@/assets/agente_suporte.png";

const Produtos = () => {
  const produtos = [
    {
      title: "Financial Assistant",
      image: agenteFinanceiro,
      description: "Transforme sua relação com o dinheiro: organize finanças, invista com inteligência e conquiste seus objetivos financeiros.",
      link: "/assistentes/financial-assistant",
    },
    {
      title: "Business Assistant",
      image: agenteBusiness,
      description: "IA para MEI e pequenos negócios: PF x PJ, fluxo de caixa, precificação, margem e checklists de obrigações — com plano de ação claro.",
      link: "/assistentes/business-assistant",
    },
    {
      title: "Sales Assistant",
      image: agenteVendas,
      description: "Venda mais, venda melhor: domine metodologias, CRMs, KPIs e estratégias que transformam vendedores comuns em top performers.",
      link: "/assistentes/sales-assistant",
    },
    {
      title: "Marketing Assistant",
      image: agenteMarketing,
      description: "Seu estrategista de marketing 24/7 para MEI/PJ: entende seu negócio, organiza ICP e funil, e entrega uma rotina simples com calendário de conteúdo, anúncios e copies sob medida para atrair e converter mais clientes.",
      link: "/assistentes/marketing-assistant",
    },
    {
      title: "Support Assistant",
      image: agenteSuporte,
      description: "Atendimento excepcional: processos, métricas e automação para encantar clientes e otimizar seu suporte.",
      link: "/assistentes/support-assistant",
    },
    {
      title: "Travel Assistant",
      image: agenteViagens,
      description: "Planeje viagens incríveis com um especialista que conhece destinos, roteiros, dicas e transforma sonhos em itinerários reais.",
      link: "/assistentes/travel-assistant",
    },
    {
      title: "Fitness Assistant",
      image: agenteFitness,
      description: "Alcance seus objetivos fitness com um guia completo que domina treinos, nutrição, recuperação e as últimas tendências.",
      link: "/assistentes/fitness-assistant",
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
              const CardWrapper = produto.link ? Link : "div";
              return (
                <CardWrapper
                  key={index}
                  to={produto.link}
                  className="group relative overflow-hidden rounded-2xl block cursor-pointer"
                >
                  <img
                    src={produto.image}
                    alt={produto.title}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <div className="text-center px-4">
                      <h3 className="text-2xl font-bold mb-2">{produto.title}</h3>
                      <p className="text-muted-foreground">{produto.description}</p>
                    </div>
                  </div>
                </CardWrapper>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Produtos;
