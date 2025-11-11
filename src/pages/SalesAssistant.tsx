import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import agenteVendas from "@/assets/agente_vendas.png";

const SalesAssistant = () => {
  const benefits = [
    {
      icon: "📈",
      title: "Aumente conversão em até 30%",
      description: "Com qualificação correta de leads"
    },
    {
      icon: "⏰",
      title: "Reduza ciclo de vendas pela metade",
      description: "Mapeando decisores desde o início"
    },
    {
      icon: "💰",
      title: "Eleve ticket médio em 20-40%",
      description: "Com técnicas de upsell e cross-sell"
    },
    {
      icon: "🎯",
      title: "Venda com método, não sorte",
      description: "Replicável, escalável, previsível"
    },
    {
      icon: "🤝",
      title: "Construa relacionamentos duradouros",
      description: "Cliente satisfeito vira embaixador"
    }
  ];

  const features = [
    "Diagnóstico do Seu Perfil - Descubra se você é Hunter (caçador), Farmer (fazendeiro), Closer (fechador) ou Consultor",
    "Metodologias Avançadas - SPIN Selling, Challenger Sale, Venda Consultiva, Customer Centric (com passo a passo de aplicação)",
    "Top 10 CRMs Analisados - HubSpot, Salesforce, Pipedrive, RD Station, Zoho, Agendor, Monday, Ploomes, Kommo, Freshworks (qual é melhor para você)",
    "13 KPIs Essenciais - Oportunidades abertas, taxa de conversão, ticket médio, CAC, LTV, ciclo de vendas, churn e mais",
    "Estratégias de Prospecção - Inbound vs Outbound, cold email, cold calling, LinkedIn, networking",
    "Tratamento de Objeções - Como responder \"está caro\", \"vou pensar\", \"não tenho orçamento\"",
    "Técnicas de Negociação - Win-win, ancoragem, concessões estratégicas",
    "Gestão de Pipeline - Como organizar, priorizar e não perder oportunidades"
  ];

  const trends = [
    "IA e Automação (80% das interações B2B serão digitais)",
    "Personalização em Escala (71% dos compradores exigem)",
    "Vendas Consultivas (foco em resolver problemas)",
    "Hiperautomação (economiza 6h por semana)",
    "Decisões Data-Driven (ROI 5-8x superior)",
    "Social Selling (LinkedIn como canal prioritário)",
    "Omnichannel (experiência integrada)",
    "ABM - Account-Based Marketing (14% mais conversão)"
  ];

  const problems = [
    "Taxa de conversão baixa (você prospecta mas não fecha)",
    "Ciclo de vendas longo (demora muito para fechar)",
    "Pipeline desorganizado (perde oportunidades no meio)",
    "Falta de follow-up (desiste cedo demais)",
    "Não sabe usar CRM (tecnologia subutilizada)",
    "Queima leads (abordagem errada)",
    "Descontos excessivos (não sabe negociar)"
  ];

  const perfectFor = [
    "SDRs que querem virar closers",
    "Closers que querem aumentar ticket médio",
    "Gestores que precisam treinar equipe",
    "Consultores que vendem projetos complexos",
    "Empreendedores que precisam vender seu produto/serviço",
    "Autônomos que dependem de vendas recorrentes"
  ];

  const methodologies = [
    {
      title: "SPIN Selling",
      items: [
        "Situação: Entenda o contexto atual",
        "Problema: Identifique dores e desafios",
        "Implicação: Explore consequências",
        "Necessidade: Conecte sua solução"
      ]
    },
    {
      title: "Challenger Sale",
      items: [
        "Ensine algo novo ao cliente",
        "Adapte ao contexto específico",
        "Assuma controle da venda",
        "Desafie o status quo"
      ]
    },
    {
      title: "Venda Consultiva",
      items: [
        "Diagnóstico profundo",
        "Prescrição personalizada",
        "Solução sob medida",
        "Relacionamento duradouro"
      ]
    }
  ];

  const profiles = [
    "Hunter (30%) - Caçador, abre novos clientes",
    "Farmer (25%) - Fazendeiro, expande contas existentes",
    "Closer (25%) - Fechador, converte oportunidades",
    "Consultor (20%) - Estratégico, vendas complexas"
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Sales <span className="text-primary">Assistant</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Venda mais, venda melhor: domine metodologias, CRMs, KPIs e estratégias que transformam vendedores comuns em top performers.
                </p>
                <Button size="lg" className="text-lg">
                  Transforme suas vendas agora. Seu mentor está pronto para te guiar.
                </Button>
              </div>
              <div className="relative">
                <img
                  src={agenteVendas}
                  alt="Sales Assistant"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-lg text-muted-foreground">
                Vender não é dom. É método, estratégia e execução inteligente. O <strong>Agente de Vendas 2025</strong> é seu mentor pessoal, construído com base nas 8 principais tendências do mercado de vendas e conhecimento dos 10 CRMs mais usados no Brasil.
              </p>
            </div>

            {/* Why Different */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Por que este agente é um game-changer?</h2>
              <p className="text-lg text-muted-foreground">
                Ele não te dá fórmulas mágicas. Ele pergunta: qual seu perfil (Hunter, Farmer, Closer, Consultor)? Qual seu mercado (B2B, B2C, SaaS)? Qual seu ticket médio? E então constrói uma estratégia ESPECÍFICA para você multiplicar seus resultados.
              </p>
            </div>

            {/* Features */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">O que você ganha:</h2>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trends */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Tendências 2025 que ele domina:</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {trends.map((trend, index) => (
                  <div key={index} className="flex gap-3 items-center p-4 rounded-lg bg-card border border-border">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <p className="text-muted-foreground">{trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Perfect For */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Perfeito para:</h2>
              <div className="grid gap-4">
                {perfectFor.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Problems */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Problemas que ele resolve:</h2>
              <div className="grid gap-4">
                {problems.map((problem, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{problem}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodologies */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Metodologias que ele ensina:</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {methodologies.map((methodology, index) => (
                  <div key={index} className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="text-xl font-bold mb-4 text-primary">{methodology.title}</h3>
                    <ul className="space-y-2">
                      {methodology.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-muted-foreground text-sm flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mb-16 p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-3xl font-bold mb-4">Dados que importam:</h2>
              <p className="text-lg text-muted-foreground">
                80% das vendas acontecem após 5 contatos, mas 80% dos vendedores desistem após 1 tentativa. O agente te ensina a persistência inteligente.
              </p>
            </div>

            {/* Profiles */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Perfis de vendedores:</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {profiles.map((profile, index) => (
                  <div key={index} className="flex gap-3 items-center p-4 rounded-lg bg-card border border-border">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <p className="text-muted-foreground">{profile}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Differential */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4">O diferencial:</h2>
              <p className="text-lg text-muted-foreground">
                Não é motivação genérica. São frameworks testados, scripts adaptáveis, métricas claras e um sistema que funciona. Baseado em dados reais do mercado brasileiro de vendas em 2025.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Benefícios</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Transforme suas vendas agora
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Seu mentor está pronto para te guiar.
              </p>
              <Button size="lg" className="text-lg">
                Começar agora
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesAssistant;
