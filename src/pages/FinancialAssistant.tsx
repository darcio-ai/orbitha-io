import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import agenteFinanceiro from "@/assets/agente_financeiro.png";

const FinancialAssistant = () => {
  const benefits = [
    {
      icon: "💰",
      title: "Economize até R$ 666/ano",
      description: "Diferença entre poupança e investimento inteligente (em R$ 10 mil)"
    },
    {
      icon: "⏱️",
      title: "Respostas em segundos",
      description: "Sem filas, sem agendamentos, disponível quando você precisar"
    },
    {
      icon: "📊",
      title: "Decisões baseadas em dados reais",
      description: "Não é achismo, são números do mercado brasileiro de 2025"
    },
    {
      icon: "🎯",
      title: "Plano de ação personalizado",
      description: "Do diagnóstico à execução, tudo adaptado ao seu perfil"
    },
    {
      icon: "🔒",
      title: "Privacidade total",
      description: "Suas informações financeiras ficam apenas entre você e o agente"
    }
  ];

  const features = [
    "Diagnóstico Personalizado - Ele pergunta sua renda, objetivos e situação atual antes de qualquer recomendação",
    "Método 50-30-20 Adaptado - Organize suas finanças de forma simples: 50% necessidades, 30% desejos, 20% futuro",
    "Comparações Reais de Investimentos - Veja quanto R$ 10.000 rendem em cada opção: LCI (R$ 11.368), CDB (R$ 11.306), Tesouro Selic (R$ 11.229) ou Poupança (R$ 10.702)",
    "Reserva de Emergência Calculada - Descubra exatamente quanto você precisa guardar (6 a 12 meses de despesas) e onde investir",
    "Estratégias de Quitação de Dívidas - Método bola de neve ou avalanche, com passo a passo claro",
    "Guia Completo de IR 2025 - Saiba quem deve declarar, quais deduções usar e como evitar a malha fina",
    "Top 10 Apps Avaliados - Recomendação personalizada: Mobills, Organizze, Minhas Economias, Spendee e mais",
    "Planos por Faixa de Renda - Estratégias específicas para quem ganha até R$ 2.000, R$ 5.000, R$ 10.000 ou mais"
  ];

  const trends = [
    "Inteligência Artificial e Automação Financeira",
    "Investimentos ESG (Sustentáveis)",
    "Fintechs e DeFi (Finanças Descentralizadas)",
    "Mobile Banking e Segurança Digital"
  ];

  const perfectFor = [
    "Quem quer sair das dívidas de uma vez por todas",
    "Quem precisa criar uma reserva de emergência",
    "Iniciantes que querem começar a investir",
    "Quem já investe e quer otimizar a carteira",
    "Empreendedores que misturam finanças PF e PJ"
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
                  Financial <span className="text-primary">Assistant</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Transforme sua relação com o dinheiro: organize finanças, invista com inteligência e conquiste seus objetivos financeiros.
                </p>
                <Button size="lg" className="text-lg">
                  Comece agora a construir seu futuro financeiro
                </Button>
              </div>
              <div className="relative">
                <img
                  src={agenteFinanceiro}
                  alt="Financial Assistant"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-lg text-muted-foreground">
                Imagine ter um especialista financeiro disponível 24/7, conhecedor profundo do mercado brasileiro, pronto para te guiar em cada decisão sobre seu dinheiro. O <strong>Agente Financeiro 2.0</strong> é isso e muito mais.
              </p>
            </div>

            {/* Why Different */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Por que este agente é diferente?</h2>
              <p className="text-lg text-muted-foreground">
                Baseado em pesquisa profunda do mercado financeiro brasileiro de 2025, este agente não trabalha com informações genéricas. Ele conhece as taxas exatas (Selic 14,65%, CDI 14,40%), compara investimentos com números reais e te mostra exatamente quanto você pode ganhar em cada aplicação.
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
              <h2 className="text-3xl font-bold mb-6">Tendências que ele domina:</h2>
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

            {/* Stats */}
            <div className="mb-16 p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-3xl font-bold mb-4">Dados que importam:</h2>
              <p className="text-lg text-muted-foreground">
                O agente conhece a realidade brasileira: <strong>43% das pessoas não têm reserva de emergência</strong>, <strong>40% gastam mais do que ganham</strong>. Ele foi criado justamente para mudar esses números na sua vida.
              </p>
            </div>

            {/* Differential */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4">O diferencial:</h2>
              <p className="text-lg text-muted-foreground">
                Não é apenas teoria. São cálculos práticos, estratégias testadas, comparações reais e um plano de ação específico para VOCÊ. Tudo baseado em dados atualizados de 2025.
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
                Comece agora a construir seu futuro financeiro
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Seu consultor está esperando.
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

export default FinancialAssistant;
