import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogPost = () => {
  const { slug } = useParams();

  // Dados dos artigos - em produção viriam de uma API
  const articles = {
    "ia-revolucionando-atendimento-cliente": {
      title: "Como a IA está revolucionando o atendimento ao cliente",
      category: "IA & Atendimento",
      readTime: "5 min",
      date: "15 Jan 2024",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
      content: `A inteligência artificial tem transformado radicalmente a forma como as empresas se relacionam com seus clientes. Neste artigo, vamos explorar como essa tecnologia está revolucionando o atendimento ao cliente.

## O que mudou no atendimento

Nos últimos anos, vimos uma evolução significativa na forma como as empresas atendem seus clientes. A IA trouxe possibilidades que antes pareciam impossíveis:

- Atendimento 24/7 sem custo adicional
- Respostas instantâneas e precisas
- Personalização em escala
- Análise de sentimento em tempo real

## Benefícios práticos da IA no atendimento

As empresas que implementam IA em seus processos de atendimento observam benefícios imediatos:

- **Redução de custos:** Menos necessidade de equipes grandes
- **Aumento na satisfação:** Respostas mais rápidas e precisas
- **Escalabilidade:** Atender milhares de clientes simultaneamente
- **Insights valiosos:** Dados sobre comportamento e preferências dos clientes

## Como implementar na sua empresa

A implementação de IA no atendimento não precisa ser complexa. Comece com:

1. Identificar os pontos de dor no atendimento atual
2. Escolher as ferramentas certas para seu negócio
3. Treinar sua equipe para trabalhar com IA
4. Monitorar e ajustar continuamente

## Conclusão

A IA não veio para substituir o atendimento humano, mas para potencializá-lo. As empresas que souberem combinar tecnologia e humanização terão uma vantagem competitiva significativa no mercado.`
    },
    "whatsapp-business-api-guia-automacao": {
      title: "WhatsApp Business API: Guia completo para automação",
      category: "WhatsApp",
      readTime: "8 min",
      date: "12 Jan 2024",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop",
      content: `O WhatsApp Business API é uma ferramenta poderosa para empresas que desejam automatizar e escalar seu atendimento via WhatsApp. Vamos explorar tudo que você precisa saber.

## O que é WhatsApp Business API?

Diferente do WhatsApp Business comum, a API permite integrações avançadas e automações que transformam a forma como você se comunica com seus clientes.

## Principais recursos

- Mensagens automáticas programadas
- Integração com CRM e sistemas internos
- Chatbots inteligentes
- Métricas e relatórios detalhados
- Múltiplos atendentes simultâneos

## Como começar

Para implementar o WhatsApp Business API, você precisará:

1. Verificar se sua empresa se qualifica
2. Escolher um provedor oficial (BSP)
3. Configurar sua conta e número
4. Desenvolver ou integrar seu chatbot
5. Treinar sua equipe

## Casos de uso práticos

Algumas aplicações práticas que trazem resultados imediatos:

- Confirmação automática de pedidos
- Lembretes de compromissos
- Atendimento pré-venda 24/7
- Suporte técnico automatizado
- Pesquisas de satisfação

## Conclusão

O WhatsApp Business API é um investimento que se paga rapidamente através da eficiência operacional e satisfação do cliente que proporciona.`
    },
    "processos-pme-automatizar": {
      title: "5 processos que toda PME deveria automatizar",
      category: "Automação",
      readTime: "6 min",
      date: "10 Jan 2024",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      content: `Pequenas e médias empresas frequentemente perdem tempo com tarefas repetitivas que poderiam ser automatizadas. Descubra os 5 processos essenciais para automatizar agora.

## 1. Atendimento ao cliente inicial

O primeiro contato com o cliente pode ser totalmente automatizado, garantindo:

- Resposta imediata 24/7
- Qualificação automática de leads
- Direcionamento para o setor correto

## 2. Gestão de agendamentos

Elimine o vai-e-vem de mensagens para marcar horários:

- Calendário sempre atualizado
- Lembretes automáticos
- Redução de no-shows

## 3. Follow-up de vendas

Nunca mais perca uma venda por esquecimento:

- Sequências de follow-up automáticas
- Personalização em escala
- Aumento da taxa de conversão

## 4. Controle financeiro básico

Automação financeira traz clareza e previsibilidade:

- Registro automático de receitas
- Controle de inadimplência
- Relatórios instantâneos

## 5. Gestão de estoque

Para empresas com produtos físicos:

- Alertas de estoque baixo
- Integração com vendas
- Previsão de demanda

## Por onde começar?

Priorize o processo que mais consome tempo da sua equipe atualmente. A automatização deve trazer alívio imediato e resultados mensuráveis.`
    },
    "zapier-vs-n8n-ferramenta-escolher": {
      title: "Zapier vs n8n: Qual ferramenta escolher para sua empresa?",
      category: "Ferramentas",
      readTime: "7 min",
      date: "8 Jan 2024",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
      content: `Comparativo completo entre Zapier e n8n para ajudar você a escolher a melhor ferramenta de automação para sua empresa.

## Zapier: O líder consolidado

**Vantagens:**

- Interface super intuitiva
- Milhares de integrações prontas
- Suporte excelente
- Não requer conhecimento técnico

**Desvantagens:**

- Custo pode ser alto com escala
- Menos flexibilidade para casos complexos
- Dependência de um serviço terceiro

## n8n: O poder da flexibilidade

**Vantagens:**

- Open source e gratuito
- Altamente customizável
- Pode ser hospedado internamente
- Suporte a código customizado

**Desvantagens:**

- Curva de aprendizado maior
- Requer conhecimento técnico
- Menos integrações nativas

## Quando escolher Zapier

Escolha Zapier se você:

- Precisa de algo funcional rapidamente
- Não tem equipe técnica
- Usa aplicações populares (Google, Slack, etc)
- Valoriza suporte e estabilidade

## Quando escolher n8n

Escolha n8n se você:

- Tem ou pode contratar conhecimento técnico
- Precisa de automações complexas
- Quer controle total dos seus dados
- Busca reduzir custos no longo prazo

## Conclusão

Ambas são ótimas ferramentas. A escolha depende do perfil da sua empresa, orçamento disponível e necessidades técnicas específicas.`
    },
    "roi-automacao-calcular-retorno": {
      title: "ROI da automação: Como calcular o retorno do investimento",
      category: "Produtividade",
      readTime: "4 min",
      date: "5 Jan 2024",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      content: `Entenda como medir o retorno do investimento das suas iniciativas de automação e justificar novos projetos.

## Métricas essenciais para acompanhar

- **Tempo economizado:** Horas/semana que a equipe deixou de gastar
- **Redução de erros:** Diminuição de retrabalho e correções
- **Aumento de capacidade:** Mais clientes atendidos com mesma equipe
- **Satisfação do cliente:** NPS e outras métricas de experiência

## Fórmula básica do ROI

ROI = (Ganhos - Custos) / Custos x 100

Onde:

- Ganhos = Economia de tempo + Aumento de receita + Redução de erros
- Custos = Investimento inicial + Custos mensais + Treinamento

## Exemplo prático

Empresa que automatizou atendimento:

- Investimento: R$ 5.000 (setup) + R$ 500/mês
- Economia: 40h/mês de equipe = R$ 2.000
- Aumento de vendas: 15% = R$ 3.000/mês
- ROI no primeiro ano: 900%

## Dicas para maximizar ROI

1. Comece com processos de alto impacto
2. Meça antes e depois com rigor
3. Ajuste e otimize continuamente
4. Documente ganhos intangíveis

## Conclusão

A automação quase sempre se paga em poucos meses. O segredo é escolher os processos certos e medir os resultados adequadamente.`
    },
    "chatbots-inteligentes-respostas-automaticas": {
      title: "Chatbots inteligentes: Além das respostas automáticas",
      category: "IA & Chatbots",
      readTime: "6 min",
      date: "3 Jan 2024",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&h=600&fit=crop",
      content: `Chatbots modernos vão muito além de respostas automáticas. Descubra como criar assistentes virtuais que realmente agregam valor.

## O que diferencia um chatbot inteligente

- Compreensão de contexto e intenção
- Personalização baseada em histórico
- Aprendizado contínuo com interações
- Integração com sistemas internos

## Casos de uso avançados

**Vendas consultivas:**

O chatbot faz perguntas qualificadoras e recomenda produtos específicos baseado nas necessidades do cliente.

**Suporte técnico inteligente:**

Diagnóstico de problemas através de perguntas direcionadas e resolução passo a passo.

**Onboarding de clientes:**

Guiar novos usuários através dos recursos do produto de forma personalizada.

## Como criar um chatbot que funciona

1. Mapeie as jornadas mais comuns dos usuários
2. Desenvolva uma personalidade consistente
3. Prepare respostas para cenários complexos
4. Tenha sempre uma saída para atendimento humano
5. Teste exaustivamente antes de lançar

## Erros comuns a evitar

- Chatbot que tenta fazer tudo sozinho
- Respostas genéricas demais
- Dificuldade para falar com humano
- Não aprender com interações passadas

## Conclusão

Um chatbot bem implementado é um membro valioso da equipe, não apenas uma ferramenta. Invista tempo no planejamento e colha os frutos no longo prazo.`
    },
    "principais-ias-do-momento": {
      title: "As Principais IAs do Momento: ChatGPT, Claude, Gemini e Mais",
      category: "Tendências",
      readTime: "5 min",
      date: "28 Nov 2024",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
      content: `O mercado de inteligência artificial está em constante evolução, com novas ferramentas e modelos surgindo a cada mês. Neste artigo, vamos explorar as principais IAs disponíveis atualmente e como cada uma pode ajudar seu negócio.

## ChatGPT (OpenAI)

O pioneiro que popularizou a IA conversacional para o grande público.

- **Pontos fortes:** Versatilidade, grande base de conhecimento, plugins e GPTs customizados
- **Ideal para:** Escrita de conteúdo, programação, análise de dados, brainstorming
- **Modelos:** GPT-4o (mais rápido) e GPT-4 Turbo (mais capaz)

## Claude (Anthropic)

Conhecido por conversas mais naturais e contextos extremamente longos.

- **Pontos fortes:** Contexto de até 200k tokens, respostas mais seguras, análise de documentos
- **Ideal para:** Análise de documentos longos, escrita criativa, tarefas que exigem nuance
- **Modelos:** Claude 3.5 Sonnet (equilibrado) e Claude 3 Opus (mais poderoso)

## Gemini (Google)

A aposta do Google com forte integração ao ecossistema da empresa.

- **Pontos fortes:** Multimodalidade nativa (texto, imagem, código), integração com Google Workspace
- **Ideal para:** Pesquisa, análise de imagens, produtividade no Google
- **Modelos:** Gemini Pro, Gemini Ultra, Gemini Flash (mais rápido)

## Llama (Meta)

A alternativa open source que democratiza o acesso à IA avançada.

- **Pontos fortes:** Código aberto, pode ser hospedado localmente, altamente customizável
- **Ideal para:** Empresas que precisam de controle total dos dados, desenvolvedores, pesquisadores
- **Modelos:** Llama 3.1 (8B, 70B, 405B parâmetros)

## Midjourney e DALL-E

As principais IAs para geração de imagens.

- **Midjourney:** Imagens mais artísticas e estilizadas, comunidade ativa no Discord
- **DALL-E 3:** Integrado ao ChatGPT, excelente para precisão em detalhes e texto em imagens

## Qual escolher para sua empresa?

A escolha depende do seu caso de uso:

- **Atendimento ao cliente:** ChatGPT ou Claude (com APIs)
- **Análise de documentos:** Claude (pelo contexto longo)
- **Geração de imagens:** Midjourney ou DALL-E
- **Privacidade de dados:** Llama (hospedado internamente)
- **Produtividade Google:** Gemini

## O futuro das IAs

Estamos apenas no começo. Nos próximos meses, esperamos ver:

- IAs cada vez mais especializadas por setor
- Melhor integração com ferramentas empresariais
- Custos mais acessíveis
- Regulamentações mais claras

## Conclusão

Não existe "a melhor IA" universal. O segredo é entender as necessidades específicas do seu negócio e experimentar diferentes ferramentas. Muitas oferecem versões gratuitas ou trials que permitem testar antes de investir.`
    }
  };

  const article = slug ? articles[slug as keyof typeof articles] : null;

  if (!article) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O artigo que você procura não existe ou foi removido.
            </p>
            <Button size="lg" className="text-lg px-6 py-3" asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar para o blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section with Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" size="lg" className="mb-6 text-lg px-6 py-3" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para o blog
            </Link>
          </Button>

          {/* Article Header */}
          <Card className="p-8 md:p-12 mb-8 bg-card border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
              <Badge variant="outline">{article.category}</Badge>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {article.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/img/darcio.jpg" 
                  alt="Autor" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">Darcio Melo</p>
                  <p className="text-sm text-muted-foreground">Especialista em IA & Automação</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </Card>

          {/* Article Body */}
          <Card className="p-8 md:p-12 mb-8 bg-card border-border">
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-ul:text-muted-foreground prose-ul:my-4
                prose-ol:text-muted-foreground prose-ol:my-4
                prose-li:my-2
                prose-strong:text-foreground prose-strong:font-semibold"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-primary text-primary-foreground border-0">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para implementar essas ideias?
              </h3>
              <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                Fale com nossos especialistas e descubra como implementar automação e IA na sua empresa.
              </p>
              <Button variant="secondary" size="lg" asChild>
                <a
                  href="https://wa.me/5513991497873?text=Oi! Vi o artigo no blog e quero implementar IA na minha empresa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com Especialista
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
