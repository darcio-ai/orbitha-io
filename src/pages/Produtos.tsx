import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ASSISTANT_DEMOS } from "@/config/assistantDemos";
import { Check } from "lucide-react";

const Produtos = () => {
  const navigate = useNavigate();

  const produtos = [
    {
      title: "Financial Assistant",
      subtitle: "Organize e prospere",
      description: "Transforme sua relação com o dinheiro",
      features: [
        "Planejamento financeiro personalizado",
        "Estratégias de investimento inteligente",
        "Controle de gastos e economia",
        "Metas financeiras claras e atingíveis"
      ],
      demoId: "financeiro",
    },
    {
      title: "Business Assistant",
      subtitle: "IA para MEI e pequenos negócios",
      description: "Gestão completa para empreendedores",
      features: [
        "Análise PF x PJ personalizada",
        "Fluxo de caixa e precificação",
        "Checklists de obrigações fiscais",
        "Plano de ação claro e executável"
      ],
      demoId: "business",
    },
    {
      title: "Sales Assistant",
      subtitle: "Venda mais, venda melhor",
      description: "Transforme-se em um top performer",
      features: [
        "Metodologias de vendas avançadas",
        "Domínio de CRMs e ferramentas",
        "KPIs e métricas de performance",
        "Estratégias de fechamento"
      ],
      demoId: "vendas",
    },
    {
      title: "Marketing Assistant",
      subtitle: "Seu estrategista 24/7",
      description: "Marketing sob medida para MEI/PJ",
      features: [
        "Definição de ICP e funil de vendas",
        "Calendário de conteúdo personalizado",
        "Copies e anúncios otimizados",
        "Estratégias para atrair e converter"
      ],
      demoId: "marketing",
    },
    {
      title: "Support Assistant",
      subtitle: "Atendimento excepcional",
      description: "Encante e fidelize seus clientes",
      features: [
        "Processos de atendimento otimizados",
        "Métricas e KPIs de suporte",
        "Automação inteligente",
        "Scripts e respostas prontas"
      ],
      demoId: "suporte",
    },
    {
      title: "Travel Assistant",
      subtitle: "Viagens incríveis, planejadas",
      description: "Seu especialista em destinos",
      features: [
        "Roteiros personalizados",
        "Dicas exclusivas de destinos",
        "Planejamento completo de viagens",
        "Orçamento e economia em viagens"
      ],
      demoId: "viagens",
    },
    {
      title: "Fitness Assistant",
      subtitle: "Alcance seus objetivos",
      description: "Guia completo de treino e nutrição",
      features: [
        "Treinos personalizados",
        "Planos nutricionais sob medida",
        "Recuperação e descanso otimizados",
        "Tendências e técnicas avançadas"
      ],
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto px-4">
            {produtos.map((produto, index) => {
              const assistantConfig = produto.demoId ? ASSISTANT_DEMOS[produto.demoId] : null;
              const planFocus = assistantConfig?.planFocus || "suite";

              return (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 flex flex-col justify-between h-full"
                >
                  {/* Header */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-slate-50 text-center">
                      {produto.title}
                    </h3>
                    <p className="text-xs md:text-sm font-semibold text-cyan-400 text-center mt-1">
                      {produto.subtitle}
                    </p>
                    <p className="text-xs md:text-sm text-slate-300 text-center mt-1">
                      {produto.description}
                    </p>

                    {/* Features List */}
                    <ul className="mt-4 space-y-2 text-sm text-slate-100">
                      {produto.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 mt-5">
                    {produto.demoId && (
                      <Button
                        onClick={() => navigate(`/demo/${produto.demoId}`)}
                        className="w-full rounded-full bg-cyan-400 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
                      >
                        Testar demo rápida
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => navigate(`/planos?focus=${planFocus}`)}
                      className="w-full rounded-full border border-slate-600 bg-transparent py-2 text-sm font-semibold text-slate-50 hover:bg-slate-800 transition"
                    >
                      Ver planos
                    </Button>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Growth Pack */}
              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-primary/40 via-white/10 to-transparent">
                <div className="rounded-2xl bg-background/80 p-4 md:p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                      Ideal para negócios
                    </span>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 md:p-4 mb-3 md:mb-4">
                    <p className="text-xs md:text-sm text-muted-foreground">Vendas • Marketing • Suporte</p>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold mb-1">Growth Pack</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                    O combo ideal pra quem quer vender mais e atender melhor.
                  </p>

                  <ul className="text-xs md:text-sm space-y-2 mb-4 md:mb-6">
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
                <div className="rounded-2xl bg-background/80 p-4 md:p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10">Recomendado</span>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 md:p-4 mb-3 md:mb-4">
                    <p className="text-xs md:text-sm text-muted-foreground">Todos os 7 assistentes</p>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold mb-1">Orbitha Suite</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">
                    Produtividade + Growth. Tudo que a Orbitha oferece.
                  </p>
                  <p className="text-xs text-muted-foreground mb-3 md:mb-4">
                    Melhor custo-benefício para quem quer usar mais de 3 assistentes.
                  </p>

                  <ul className="text-xs md:text-sm space-y-2 mb-4 md:mb-6">
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
