import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import agenteViagens from "@/assets/agente_viagens.png";

const TravelAssistant = () => {
  const benefits = [
    {
      icon: "🌍",
      title: "Economize horas de pesquisa",
      description: "O que levaria dias, ele faz em minutos"
    },
    {
      icon: "💰",
      title: "Otimize seu orçamento",
      description: "Gaste com o que importa, economize no resto"
    },
    {
      icon: "📍",
      title: "Descubra lugares únicos",
      description: "Além dos pontos turísticos óbvios"
    },
    {
      icon: "⏰",
      title: "Aproveite cada minuto",
      description: "Roteiros otimizados para não perder tempo"
    },
    {
      icon: "🛡️",
      title: "Viaje com segurança",
      description: "Dicas de segurança, golpes comuns, áreas a evitar"
    }
  ];

  const features = [
    "Roteiros Personalizados - Itinerário dia a dia, com horários, deslocamentos e tempo em cada atração",
    "Orçamento Realista - Quanto você vai gastar com hospedagem, alimentação, transporte e passeios",
    "Dicas Locais - Aqueles lugares que só quem conhece o destino sabe (restaurantes escondidos, mirantes secretos, horários ideais)",
    "Planejamento Logístico - Como ir do aeroporto ao hotel, qual transporte usar, como se locomover pela cidade",
    "Documentação Necessária - Visto, vacinas, seguro viagem, o que não pode faltar",
    "Melhores Épocas - Quando ir para evitar chuvas, multidões ou pegar eventos especiais",
    "Opções de Hospedagem - Hotéis, hostels, Airbnb, com prós e contras de cada área da cidade",
    "Roteiros Alternativos - Plano B para dias de chuva ou se algo não sair como esperado"
  ];

  const travelFormats = [
    "Viagens em família (com crianças, pais ou avós)",
    "Viagens românticas (lua de mel, aniversário, pedido de casamento)",
    "Viagens solo (segurança, socialização, roteiros flexíveis)",
    "Mochilão (econômico, autêntico, off the beaten path)",
    "Viagens corporativas (eventos, networking, otimização de tempo)",
    "Road trips (roteiros de carro, paradas estratégicas)"
  ];

  const perfectFor = [
    "Quem tem pouco tempo para pesquisar",
    "Quem quer aproveitar cada minuto do destino",
    "Quem viaja pela primeira vez para um lugar",
    "Quem quer fugir do óbvio e descobrir lugares únicos",
    "Quem precisa convencer o chefe de que a viagem está bem planejada"
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
                  Travel <span className="text-primary">Assistant</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Planeje viagens incríveis com um especialista que conhece destinos, roteiros, dicas e transforma sonhos em itinerários reais.
                </p>
                <Button size="lg" className="text-lg">
                  Sua próxima aventura começa aqui. Vamos planejar juntos?
                </Button>
              </div>
              <div className="relative">
                <img
                  src={agenteViagens}
                  alt="Travel Assistant"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-lg text-muted-foreground">
                Viajar é sobre experiências inesquecíveis. Mas planejar? Isso pode ser estressante. Até agora. O <strong>Agente de Viagem</strong> é seu parceiro pessoal para transformar ideias vagas em roteiros detalhados, cheios de dicas que só quem realmente conhece o destino sabe.
              </p>
            </div>

            {/* Why Different */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Por que você vai amar este agente?</h2>
              <p className="text-lg text-muted-foreground">
                Ele não te joga uma lista genérica de pontos turísticos. Ele pergunta: que tipo de viajante você é? Aventureiro? Romântico? Cultural? Família? Solo? E então cria um roteiro sob medida, considerando seu orçamento, tempo disponível e estilo.
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

            {/* Travel Formats */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Formatos de viagem que ele domina:</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {travelFormats.map((format, index) => (
                  <div key={index} className="flex gap-3 items-center p-4 rounded-lg bg-card border border-border">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <p className="text-muted-foreground">{format}</p>
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

            {/* Differential */}
            <div className="mb-16 p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-3xl font-bold mb-4">O diferencial:</h2>
              <p className="text-lg text-muted-foreground">
                Ele não apenas lista atrações. Ele conta a HISTÓRIA por trás de cada lugar, sugere a melhor sequência para evitar filas, indica restaurantes com melhor custo-benefício e até ajusta o roteiro se você cansar no meio do dia.
              </p>
            </div>

            {/* Destinations */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4">Destinos que ele conhece:</h2>
              <p className="text-lg text-muted-foreground">
                Nacionais (todas as regiões do Brasil) e internacionais (Europa, Américas, Ásia, África, Oceania). Se existe, ele conhece ou pesquisa profundamente para você.
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
                Sua próxima aventura começa aqui
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Vamos planejar juntos?
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

export default TravelAssistant;
