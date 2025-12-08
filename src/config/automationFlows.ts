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
    name: "Disparador Inteligente Whats",
    shortDescription: "Envie mensagens em massa com segurança e personalização",
    description: "Potencialize Suas Vendas com o Disparador Inteligente de WhatsApp. Chega de perder tempo enviando mensagens uma a uma. Nossa ferramenta de automação transforma sua lista de contatos em clientes ativos, com tecnologia pensada para garantir a entrega e a conversão.",
    image: "/flows/disparo-whats.png",
    category: "Marketing",
    integrations: ["WhatsApp", "Google Sheets", "Planilhas Google"],
    features: [
      "Humanização Real: Áudios que chegam como 'gravados na hora' (não como arquivo encaminhado)",
      "Personalização em Escala: Chame cada cliente pelo nome automaticamente",
      "Segurança Anti-Bloqueio: Rotação de mensagens e delays inteligentes",
      "Multimídia Completa: Envie PDFs, imagens com legendas ou textos",
      "Gestão Simples: Tudo controlado por planilha do Google"
    ],
    benefits: [
      "Taxa de escuta e resposta drasticamente maior",
      "Conexão imediata com clientes",
      "Proteção do seu número contra bloqueio"
    ],
    steps: [
      { title: "Configure a Planilha", description: "Preencha sua lista de contatos na planilha Google" },
      { title: "Escolha o Formato", description: "Selecione entre texto, áudio, imagem ou PDF" },
      { title: "Personalize", description: "Configure mensagens variadas e delays inteligentes" },
      { title: "Dispare", description: "Inicie o envio automatizado e acompanhe os resultados" }
    ],
    estimatedTime: "Implementação em 1-2 dias"
  },
  {
    id: "flow-2",
    name: "Automação de Vendas Blindada",
    shortDescription: "Meio de Pagamento → CRM + WhatsApp com segurança anti-fraude",
    description: "Elimine o trabalho manual e garanta segurança total nas suas vendas. Este fluxo automatizado processa pagamentos do Mercado Pago, valida a transação em tempo real para evitar fraudes, notifica sua equipe via WhatsApp e organiza o cliente automaticamente no seu CRM (Pipedrive).",
    image: "/flows/vendas-blindada.png",
    category: "Vendas",
    integrations: ["Mercado Pago", "Pipedrive", "WhatsApp", "Evolution API"],
    features: [
      "Monitoramento Instantâneo: Captura vendas via Webhook do Mercado Pago",
      "Segurança Anti-Fraude: Valida pagamentos na API oficial (previne webhooks falsos)",
      "Filtro Inteligente: Processa apenas vendas com status 'aprovado'",
      "Notificação WhatsApp: Alerta imediato com valor, ID e produto via Evolution API",
      "Gestão de CRM: Cria/atualiza contato e abre Deal no Pipedrive automaticamente"
    ],
    benefits: [
      "Zero trabalho manual no processamento de vendas",
      "Proteção total contra golpes e fraudes",
      "Equipe notificada em tempo real"
    ],
    steps: [
      { title: "Captura", description: "Webhook recebe a notificação de venda do Mercado Pago" },
      { title: "Validação", description: "API oficial confirma se o pagamento é real e aprovado" },
      { title: "Notificação", description: "Alerta enviado via WhatsApp para sua equipe" },
      { title: "CRM", description: "Contato criado/atualizado e Deal aberto no Pipedrive" }
    ],
    estimatedTime: "Implementação em 2-3 dias"
  },
  {
    id: "flow-3",
    name: "Agente SDR com Inteligência Artificial",
    shortDescription: "Nunca mais deixe um lead 'esfriar' com follow-up automático",
    description: "Aumente suas taxas de conversão recuperando leads que pararam de responder. Esta automação avançada atua como um SDR (Pré-vendas) incansável, monitorando seus leads 24/7 e entrando em ação estrategicamente quando o contato é interrompido.",
    image: "/flows/sdr-followup.png",
    category: "Vendas",
    integrations: ["OpenAI", "WhatsApp", "Supabase", "Notion"],
    features: [
      "Vox IA: Agente baseado em GPT-4o que lê o histórico e cria mensagens personalizadas",
      "Monitoramento Ativo: Sistema verifica constantemente se leads pararam de responder",
      "Primeira Tentativa (30 min): Mensagem amigável e contextualizada para retomar o diálogo",
      "Segunda Tentativa (2h): Mensagem persuasiva com gatilhos de urgência e incentivos",
      "Finalização Inteligente (4h): Encerra atendimento e atualiza CRM automaticamente"
    ],
    benefits: [
      "Leads nunca mais 'esfriam' por falta de follow-up",
      "Recuperação automática de oportunidades perdidas",
      "Base de dados sempre limpa e organizada"
    ],
    steps: [
      { title: "Monitoramento", description: "Sistema detecta quando um Novo Lead para de responder" },
      { title: "1ª Tentativa", description: "Após 30 min, IA envia mensagem amigável e contextualizada" },
      { title: "2ª Tentativa", description: "Após 2h, mensagem persuasiva com urgência e desconto" },
      { title: "Finalização", description: "Após 4h, encerra atendimento e atualiza o CRM" }
    ],
    estimatedTime: "Implementação em 3-5 dias"
  },
  {
    id: "flow-4",
    name: "Conheça a Dora: Atendimento WhatsApp com IA",
    shortDescription: "Agente de IA para atendimento 24/7 no WhatsApp",
    description: "A Dora não é apenas um chatbot; é a agente de inteligência artificial oficial da Orbitha, projetada para transformar o atendimento da sua empresa. Operando 24 horas por dia, 7 dias por semana, a Dora combina a empatia humana com a precisão da tecnologia para qualificar leads, tirar dúvidas e agendar reuniões automaticamente.",
    image: "/flows/dora-ai.png",
    category: "Atendimento",
    integrations: ["WhatsApp", "OpenAI", "Google Calendar", "Supabase"],
    features: [
      "Omnicanal e Acessível: Entende textos e ouve áudios (transcrição automática)",
      "Memória Inteligente: Lembra do nome do cliente e do histórico da conversa",
      "Venda Consultiva: Diagnostica dores do cliente e oferece soluções ideais",
      "Gestão de Agenda Real: Integrada ao Google Calendar, agenda reuniões sem conflitos",
      "Atendimento 24/7: Disponível a qualquer hora, todos os dias da semana"
    ],
    benefits: [
      "Atendimento contínuo sem equipe de plantão",
      "Leads qualificados automaticamente antes da reunião",
      "Zero conflitos de agenda com integração direta ao calendário"
    ],
    steps: [
      { title: "Recepção", description: "Cliente envia mensagem no WhatsApp (texto ou áudio)" },
      { title: "Compreensão", description: "Dora transcreve áudios e entende a necessidade" },
      { title: "Qualificação", description: "Identifica dores e apresenta soluções personalizadas" },
      { title: "Agendamento", description: "Verifica disponibilidade e agenda reunião no Google Calendar" }
    ],
    estimatedTime: "Implementação em 5-7 dias"
  }
];
