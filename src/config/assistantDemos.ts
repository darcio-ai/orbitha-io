export interface AssistantDemo {
  id: string;
  name: string;
  openingMessage: string;
  demoLimit: number;
  planFocus: 'suite' | 'growth';
}

export const ASSISTANT_DEMOS: Record<string, AssistantDemo> = {
  financeiro: {
    id: 'financeiro',
    name: 'Financial Assistant',
    openingMessage: 'Me diga em 1 frase sua situação financeira atual e seu objetivo principal.',
    demoLimit: 4,
    planFocus: 'suite',
  },
  fitness: {
    id: 'fitness',
    name: 'Fitness Assistant',
    openingMessage: 'Qual seu objetivo principal? (emagrecer, ganhar massa, saúde)',
    demoLimit: 4,
    planFocus: 'suite',
  },
  viagens: {
    id: 'viagens',
    name: 'Travel Assistant',
    openingMessage: 'Pra onde você quer viajar e quando? Me fale destino e datas aproximadas.',
    demoLimit: 4,
    planFocus: 'suite',
  },
  vendas: {
    id: 'vendas',
    name: 'Sales Assistant',
    openingMessage: 'Qual produto/serviço você vende e quem é seu cliente ideal?',
    demoLimit: 4,
    planFocus: 'growth',
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Assistant',
    openingMessage: 'Qual seu negócio e qual canal quer melhorar primeiro?',
    demoLimit: 4,
    planFocus: 'growth',
  },
  business: {
    id: 'business',
    name: 'Business Assistant',
    openingMessage: 'Qual desafio de negócio você quer destravar agora?',
    demoLimit: 4,
    planFocus: 'suite',
  },
  suporte: {
    id: 'suporte',
    name: 'Support Assistant',
    openingMessage: 'Que tipo de atendimento no WhatsApp você quer automatizar?',
    demoLimit: 3,
    planFocus: 'growth',
  },
};
