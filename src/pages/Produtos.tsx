import agenteFinanceiro from "@/assets/agente_financeiro.png";
import agenteFitness from "@/assets/agente_fitness.png";
import agenteVendas from "@/assets/agente_vendas.png";
import agenteViagens from "@/assets/agente_viagens.png";

const Produtos = () => {
  const produtos = [
    {
      title: "Financial Assistant",
      image: agenteFinanceiro,
      description: "Assistente de IA especializado em finanças",
    },
    {
      title: "Sales Assistant",
      image: agenteVendas,
      description: "Assistente de IA especializado em vendas",
    },
    {
      title: "Travel Assistant",
      image: agenteViagens,
      description: "Assistente de IA especializado em viagens",
    },
    {
      title: "Fitness Assistant",
      image: agenteFitness,
      description: "Assistente de IA especializado em fitness e saúde",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nossos <span className="text-primary">Produtos</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Agentes de IA especializados para transformar seu negócio
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {produtos.map((produto, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={produto.image}
                  alt={produto.title}
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{produto.title}</h3>
                    <p className="text-muted-foreground">{produto.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Produtos;
