export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  category: string;
  integrations: string[];
  features: string[];
  benefits: string[];
  steps: { title: string; description: string }[];
  estimatedTime: string;
}

export const automationFlows: AutomationFlow[] = [
  {
    id: "flow-1",
    name: "Automação de Leads",
    shortDescription: "Capture e qualifique leads automaticamente",
    description: "Fluxo completo de captura, qualificação e nutrição de leads integrando formulários, CRM e email marketing.",
    image: "/flows/flow-1.png",
    category: "Vendas",
    integrations: ["Google Forms", "HubSpot", "Mailchimp", "WhatsApp"],
    features: [
      "Captura automática de leads de múltiplas fontes",
      "Qualificação por scoring inteligente",
      "Envio de sequências de email personalizadas",
      "Notificação em tempo real para o time de vendas",
      "Sincronização com CRM"
    ],
    benefits: [
      "3x mais leads qualificados",
      "Redução de 70% no tempo de resposta",
      "Zero leads perdidos"
    ],
    steps: [
      { title: "Captura", description: "Lead preenche formulário ou envia mensagem" },
      { title: "Enriquecimento", description: "Dados são validados e enriquecidos automaticamente" },
      { title: "Qualificação", description: "IA analisa e atribui score ao lead" },
      { title: "Distribuição", description: "Lead é enviado para o vendedor certo" }
    ],
    estimatedTime: "Implementação em 3-5 dias"
  },
  {
    id: "flow-2",
    name: "Atendimento Inteligente",
    shortDescription: "Suporte 24/7 com IA conversacional",
    description: "Automatize o atendimento ao cliente com IA que entende contexto, resolve problemas e escala quando necessário.",
    image: "/flows/flow-2.png",
    category: "Atendimento",
    integrations: ["WhatsApp Business", "Zendesk", "Notion", "Slack"],
    features: [
      "Respostas instantâneas 24/7",
      "Base de conhecimento integrada",
      "Escalação inteligente para humanos",
      "Histórico completo de conversas",
      "Análise de sentimento em tempo real"
    ],
    benefits: [
      "95% das dúvidas resolvidas automaticamente",
      "Atendimento 24/7 sem custo adicional",
      "NPS aumentado em 40%"
    ],
    steps: [
      { title: "Recepção", description: "Cliente inicia conversa em qualquer canal" },
      { title: "Análise", description: "IA identifica intenção e contexto" },
      { title: "Resolução", description: "Resposta automática ou ação executada" },
      { title: "Feedback", description: "Registro e aprendizado contínuo" }
    ],
    estimatedTime: "Implementação em 5-7 dias"
  },
  {
    id: "flow-3",
    name: "Relatórios Automáticos",
    shortDescription: "Dashboards e relatórios sem esforço manual",
    description: "Gere relatórios automaticamente coletando dados de múltiplas fontes e enviando insights por email ou Slack.",
    image: "/flows/flow-3.png",
    category: "Analytics",
    integrations: ["Google Sheets", "PostgreSQL", "Slack", "Email"],
    features: [
      "Coleta automática de dados de múltiplas fontes",
      "Geração de gráficos e visualizações",
      "Envio programado por email/Slack",
      "Alertas de métricas críticas",
      "Comparativos históricos automáticos"
    ],
    benefits: [
      "10h/semana economizadas em relatórios manuais",
      "Dados sempre atualizados",
      "Decisões baseadas em dados reais"
    ],
    steps: [
      { title: "Coleta", description: "Dados são extraídos das fontes configuradas" },
      { title: "Processamento", description: "Métricas são calculadas e comparadas" },
      { title: "Visualização", description: "Gráficos e tabelas são gerados" },
      { title: "Distribuição", description: "Relatório enviado aos destinatários" }
    ],
    estimatedTime: "Implementação em 2-4 dias"
  },
  {
    id: "flow-4",
    name: "Onboarding de Clientes",
    shortDescription: "Jornada de boas-vindas automatizada",
    description: "Automatize todo o processo de onboarding de novos clientes com sequências de emails, tarefas e check-ins.",
    image: "/flows/flow-4.png",
    category: "Customer Success",
    integrations: ["Stripe", "Mailchimp", "Calendly", "Notion"],
    features: [
      "Sequência de boas-vindas personalizada",
      "Agendamento automático de calls de kickoff",
      "Checklist de onboarding interativo",
      "Alertas de clientes em risco",
      "Métricas de adoção do produto"
    ],
    benefits: [
      "Time-to-value reduzido em 50%",
      "Churn nos primeiros 30 dias reduzido",
      "Experiência consistente para todos os clientes"
    ],
    steps: [
      { title: "Ativação", description: "Cliente finaliza compra/contrato" },
      { title: "Boas-vindas", description: "Sequência de emails é disparada" },
      { title: "Kickoff", description: "Call de onboarding é agendada automaticamente" },
      { title: "Acompanhamento", description: "Check-ins e métricas são monitorados" }
    ],
    estimatedTime: "Implementação em 4-6 dias"
  }
];
