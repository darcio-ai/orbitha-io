import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import agenteFitness from "@/assets/agente_fitness.png";

const FitnessAssistant = () => {
  const benefits = [
    {
      icon: "🎯",
      title: "Resultados em 8-12 semanas",
      description: "Com consistência, mudanças visíveis acontecem"
    },
    {
      icon: "💪",
      title: "Treinos de 30-60 minutos",
      description: "Eficientes, não precisa viver na academia"
    },
    {
      icon: "🍽️",
      title: "Nutrição sem radicalismo",
      description: "Equilibrada, sustentável, prazerosa"
    },
    {
      icon: "📱",
      title: "Apps integrados",
      description: "Acompanhe progresso, conte calorias, monitore treinos"
    },
    {
      icon: "🧘",
      title: "Saúde mental incluída",
      description: "Exercício é sobre sentir-se bem, não punição"
    }
  ];

  const features = [
    "Avaliação Inicial Completa - Nível de condicionamento, objetivos (emagrecimento, hipertrofia, performance), restrições físicas",
    "Plano de Treino Personalizado - Divisão de treino (ABC, ABCD, Full Body), exercícios específicos, séries, repetições, descanso",
    "Orientações Nutricionais - Macros (proteínas, carbos, gorduras), timing de refeições, suplementação (se necessário)",
    "Progressão Inteligente - Como evoluir semana a semana sem estagnar ou se lesionar",
    "Recuperação e Descanso - Importância do sono, alongamentos, foam roller, dias off",
    "Motivação e Consistência - Estratégias para manter disciplina nos dias difíceis",
    "Top Apps Recomendados - MyFitnessPal, Strava, Nike Training Club, Apple Fitness+ (conforme seu objetivo)",
    "Treinos por Modalidade - Musculação, HIIT, Funcional, Calistenia, Yoga, Corrida, Natação"
  ];

  const trends = [
    "Tecnologia vestível (smartwatches, monitores de frequência)",
    "Apps mobile e treinos online",
    "Personal training virtual",
    "Programas para idosos (longevidade ativa)",
    "HIIT (treinos curtos e intensos)",
    "Calistenia (treino com peso corporal)",
    "Treino funcional (movimentos do dia a dia)",
    "Exercícios ao ar livre (conexão com natureza)",
    "Integração saúde mental + física",
    "Treinamento baseado em dados (biohacking)"
  ];

  const goals = [
    "Emagrecimento (queima de gordura sustentável)",
    "Hipertrofia (ganho de massa muscular)",
    "Performance (correr mais rápido, levantar mais peso)",
    "Saúde geral (prevenir doenças, longevidade)",
    "Estética (corpo definido, proporções)",
    "Qualidade de vida (mais energia, melhor sono)"
  ];

  const perfectFor = [
    "Iniciantes que não sabem por onde começar",
    "Intermediários que estagnou nos resultados",
    "Avançados que querem otimizar performance",
    "Pessoas com restrições (lesões, idade, tempo)",
    "Quem treina sozinho e precisa de direção"
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
                  Fitness <span className="text-primary">Assistant</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Alcance seus objetivos fitness com um guia completo que domina treinos, nutrição, recuperação e as últimas tendências.
                </p>
                <Button size="lg" className="text-lg">
                  Seu corpo merece a melhor versão de você. Vamos começar hoje?
                </Button>
              </div>
              <div className="relative">
                <img
                  src={agenteFitness}
                  alt="Fitness Assistant"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-lg text-muted-foreground">
                Transformar o corpo não é sobre força de vontade. É sobre ter o plano certo, no momento certo, com as informações certas. O <strong>Agente Fitness 2025</strong> é seu aliado nessa jornada, baseado nas top 10 tendências do mercado fitness brasileiro.
              </p>
            </div>

            {/* Why Different */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Por que este agente é indispensável?</h2>
              <p className="text-lg text-muted-foreground">
                Ele não te dá uma ficha genérica de treino. Ele entende VOCÊ: seu nível atual, seus objetivos, seu tempo disponível, suas limitações e até suas preferências. Treina em casa? Academia? Ao ar livre? Ele adapta tudo.
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

            {/* Goals */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Objetivos que ele te ajuda a alcançar:</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {goals.map((goal, index) => (
                  <div key={index} className="flex gap-3 items-center p-4 rounded-lg bg-card border border-border">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <p className="text-muted-foreground">{goal}</p>
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
                70% das pessoas buscam transformação física, 60% querem melhorar saúde, 50% focam em estética. O agente equilibra os três aspectos para resultados reais e duradouros.
              </p>
            </div>

            {/* Differential */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4">O diferencial:</h2>
              <p className="text-lg text-muted-foreground">
                Ele não é apenas sobre "levanta peso e coma frango". É sobre entender seu corpo, respeitar seus limites, progredir de forma inteligente e criar hábitos que duram para sempre. Não é dieta, é estilo de vida.
              </p>
            </div>

            {/* Knowledge */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4">Conhecimento atualizado:</h2>
              <p className="text-lg text-muted-foreground">
                Apps mais eficazes, dúvidas comuns respondidas, mitos desmascarados, ciência aplicada. Tudo baseado em pesquisa do mercado fitness brasileiro de 2025.
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
                Seu corpo merece a melhor versão de você
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Vamos começar hoje?
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

export default FitnessAssistant;
