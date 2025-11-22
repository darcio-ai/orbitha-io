import { Link } from "react-router-dom";

import agenteFinanceiro from "@/assets/agente_financeiro.png";
import agenteFitness from "@/assets/agente_fitness.png";
import agenteVendas from "@/assets/agente_vendas.png";
import agenteViagens from "@/assets/agente_viagens.png";
import assistenteBusiness from "@/assets/assistente-business.png";

// Se você tiver versões hover, importe aqui.
// Se ainda não tiver alguma, pode repetir a mesma imagem (como fiz no business).
import agenteFinanceiroHover from "@/assets/agente_financeiro_hover.png";
import agenteFitnessHover from "@/assets/agente_fitness_hover.png";
import agenteVendasHover from "@/assets/agente_vendas_hover.png";
import agenteViagensHover from "@/assets/agente_viagens_hover.png";
import assistenteBusinessHover from "@/assets/assistente-business.png";

const Produtos = () => {
  const produtos = [
    {
      title: "Financial Assistant",
      subtitle: "Score Patrimonial 0–100",
      image: agenteFinanceiro,
      hoverImage: agenteFinanceiroHover,
      description:
        "Descubra seu Score Patrimonial em 60s. Diagnóstico completo em 5 pilares + classificação automática + plano de ação personalizado.",
      link: "/assistentes/financial-assistant",
      badge: "Mais vendido",
    },
    {
      title: "Sales Assistant",
      subtitle: "Prospecção, SPIN, CRM e scripts",
      image: agenteVendas,
      hoverImage: agenteVendasHover,
      description:
        "Diagnóstico comercial + playbook por etapa do funil + cadências prontas + kit de objeções e templates (WhatsApp, e-mail, LinkedIn, call).",
      link: "/assistentes/sales-assistant",
    },
    {
      title: "Travel Assistant",
      subtitle: "Roteiros inteligentes sob medida",
      image: agenteViagens,
      hoverImage: agenteViagensHover,
      description:
        "Itinerário dia a dia com horários, deslocamentos e tempo ideal em cada atração + orçamento realista + dicas locais e plano B.",
      link: "/assistentes/travel-assistant",
    },
    {
      title: "Fitness Assistant",
      subtitle: "Treinos + nutrição simples",
      image: agenteFitness,
      hoverImage: agenteFitnessHover,
      description:
        "Treino personalizado por objetivo e nível + progressão inteligente + nutrição educativa (macros/TMB/TDEE) + hábitos e recuperação.",
      link: "/assistentes/fitness-assistant",
    },
    {
      title: "Business Assistant",
      subtitle: "Gestão PJ/MEI e crescimento",
      image: assistenteBusiness,
      hoverImage: assistenteBusinessHover, // troca depois pela versão hover real
      description:
        "Copiloto de negócios para MEIs e PMEs: fluxo de caixa, precificação, indicadores, rotinas financeiras e plano 7/30/90 dias para crescer com segurança.",
      link: "/assistentes/business-assistant",
      badge: "Novo",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nossos <span className="text-primary">Assistentes</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Assistentes de IA especializados para transformar sua rotina e seus resultados
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
                  className="
                    group relative overflow-hidden rounded-2xl block cursor-pointer
                    border border-border bg-card
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-2xl hover:border-primary/40
                  "
                >
                  {/* Área da imagem */}
                  <div className="relative w-full aspect-[16/10] md:aspect-[16/9]">
                    {/* Imagem NORMAL */}
                    <img
                      src={produto.image}
                      alt={produto.title}
                      className="
                        absolute inset-0 w-full h-full object-contain
                        transition-all duration-700 ease-out
                        group-hover:scale-105 gro
::contentReference[oaicite:0]{index=0}
