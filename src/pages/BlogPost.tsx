import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

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
      content: `
        <p>A inteligência artificial tem transformado radicalmente a forma como as empresas se relacionam com seus clientes. Neste artigo, vamos explorar como essa tecnologia está revolucionando o atendimento ao cliente.</p>

        <h2>O que mudou no atendimento</h2>
        <p>Nos últimos anos, vimos uma evolução significativa na forma como as empresas atendem seus clientes. A IA trouxe possibilidades que antes pareciam impossíveis:</p>
        <ul>
          <li>Atendimento 24/7 sem custo adicional</li>
          <li>Respostas instantâneas e precisas</li>
          <li>Personalização em escala</li>
          <li>Análise de sentimento em tempo real</li>
        </ul>

        <h2>Benefícios práticos da IA no atendimento</h2>
        <p>As empresas que implementam IA em seus processos de atendimento observam benefícios imediatos:</p>
        <ul>
          <li><strong>Redução de custos:</strong> Menos necessidade de equipes grandes</li>
          <li><strong>Aumento na satisfação:</strong> Respostas mais rápidas e precisas</li>
          <li><strong>Escalabilidade:</strong> Atender milhares de clientes simultaneamente</li>
          <li><strong>Insights valiosos:</strong> Dados sobre comportamento e preferências dos clientes</li>
        </ul>

        <h2>Como implementar na sua empresa</h2>
        <p>A implementação de IA no atendimento não precisa ser complexa. Comece com:</p>
        <ol>
          <li>Identificar os pontos de dor no atendimento atual</li>
          <li>Escolher as ferramentas certas para seu negócio</li>
          <li>Treinar sua equipe para trabalhar com IA</li>
          <li>Monitorar e ajustar continuamente</li>
        </ol>

        <h2>Conclusão</h2>
        <p>A IA não veio para substituir o atendimento humano, mas para potencializá-lo. As empresas que souberem combinar tecnologia e humanização terão uma vantagem competitiva significativa no mercado.</p>
      `
    },
    "whatsapp-business-api-guia-automacao": {
      title: "WhatsApp Business API: Guia completo para automação",
      category: "WhatsApp",
      readTime: "8 min",
      date: "12 Jan 2024",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop",
      content: `
        <p>O WhatsApp Business API é uma ferramenta poderosa para empresas que desejam automatizar e escalar seu atendimento via WhatsApp. Vamos explorar tudo que você precisa saber.</p>

        <h2>O que é WhatsApp Business API?</h2>
        <p>Diferente do WhatsApp Business comum, a API permite integrações avançadas e automações que transformam a forma como você se comunica com seus clientes.</p>

        <h2>Principais recursos</h2>
        <ul>
          <li>Mensagens automáticas programadas</li>
          <li>Integração com CRM e sistemas internos</li>
          <li>Chatbots inteligentes</li>
          <li>Métricas e relatórios detalhados</li>
          <li>Múltiplos atendentes simultâneos</li>
        </ul>

        <h2>Como começar</h2>
        <p>Para implementar o WhatsApp Business API, você precisará:</p>
        <ol>
          <li>Verificar se sua empresa se qualifica</li>
          <li>Escolher um provedor oficial (BSP)</li>
          <li>Configurar sua conta e número</li>
          <li>Desenvolver ou integrar seu chatbot</li>
          <li>Treinar sua equipe</li>
        </ol>

        <h2>Casos de uso práticos</h2>
        <p>Algumas aplicações práticas que trazem resultados imediatos:</p>
        <ul>
          <li>Confirmação automática de pedidos</li>
          <li>Lembretes de compromissos</li>
          <li>Atendimento pré-venda 24/7</li>
          <li>Suporte técnico automatizado</li>
          <li>Pesquisas de satisfação</li>
        </ul>

        <h2>Conclusão</h2>
        <p>O WhatsApp Business API é um investimento que se paga rapidamente através da eficiência operacional e satisfação do cliente que proporciona.</p>
      `
    },
    "processos-pme-automatizar": {
      title: "5 processos que toda PME deveria automatizar",
      category: "Automação",
      readTime: "6 min",
      date: "10 Jan 2024",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      content: `
        <p>Pequenas e médias empresas frequentemente perdem tempo com tarefas repetitivas que poderiam ser automatizadas. Descubra os 5 processos essenciais para automatizar agora.</p>

        <h2>1. Atendimento ao cliente inicial</h2>
        <p>O primeiro contato com o cliente pode ser totalmente automatizado, garantindo:</p>
        <ul>
          <li>Resposta imediata 24/7</li>
          <li>Qualificação automática de leads</li>
          <li>Direcionamento para o setor correto</li>
        </ul>

        <h2>2. Gestão de agendamentos</h2>
        <p>Elimine o vai-e-vem de mensagens para marcar horários:</p>
        <ul>
          <li>Calendário sempre atualizado</li>
          <li>Lembretes automáticos</li>
          <li>Redução de no-shows</li>
        </ul>

        <h2>3. Follow-up de vendas</h2>
        <p>Nunca mais perca uma venda por esquecimento:</p>
        <ul>
          <li>Sequências de follow-up automáticas</li>
          <li>Personalização em escala</li>
          <li>Aumento da taxa de conversão</li>
        </ul>

        <h2>4. Controle financeiro básico</h2>
        <p>Automação financeira traz clareza e previsibilidade:</p>
        <ul>
          <li>Registro automático de receitas</li>
          <li>Controle de inadimplência</li>
          <li>Relatórios instantâneos</li>
        </ul>

        <h2>5. Gestão de estoque</h2>
        <p>Para empresas com produtos físicos:</p>
        <ul>
          <li>Alertas de estoque baixo</li>
          <li>Integração com vendas</li>
          <li>Previsão de demanda</li>
        </ul>

        <h2>Por onde começar?</h2>
        <p>Priorize o processo que mais consome tempo da sua equipe atualmente. A automatização deve trazer alívio imediato e resultados mensuráveis.</p>
      `
    },
    "zapier-vs-n8n-ferramenta-escolher": {
      title: "Zapier vs n8n: Qual ferramenta escolher para sua empresa?",
      category: "Ferramentas",
      readTime: "7 min",
      date: "8 Jan 2024",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
      content: `
        <p>Comparativo completo entre Zapier e n8n para ajudar você a escolher a melhor ferramenta de automação para sua empresa.</p>

        <h2>Zapier: O líder consolidado</h2>
        <p><strong>Vantagens:</strong></p>
        <ul>
          <li>Interface super intuitiva</li>
          <li>Milhares de integrações prontas</li>
          <li>Suporte excelente</li>
          <li>Não requer conhecimento técnico</li>
        </ul>
        <p><strong>Desvantagens:</strong></p>
        <ul>
          <li>Custo pode ser alto com escala</li>
          <li>Menos flexibilidade para casos complexos</li>
          <li>Dependência de um serviço terceiro</li>
        </ul>

        <h2>n8n: O poder da flexibilidade</h2>
        <p><strong>Vantagens:</strong></p>
        <ul>
          <li>Open source e gratuito</li>
          <li>Altamente customizável</li>
          <li>Pode ser hospedado internamente</li>
          <li>Suporte a código customizado</li>
        </ul>
        <p><strong>Desvantagens:</strong></p>
        <ul>
          <li>Curva de aprendizado maior</li>
          <li>Requer conhecimento técnico</li>
          <li>Menos integrações nativas</li>
        </ul>

        <h2>Quando escolher Zapier</h2>
        <p>Escolha Zapier se você:</p>
        <ul>
          <li>Precisa de algo funcional rapidamente</li>
          <li>Não tem equipe técnica</li>
          <li>Usa aplicações populares (Google, Slack, etc)</li>
          <li>Valoriza suporte e estabilidade</li>
        </ul>

        <h2>Quando escolher n8n</h2>
        <p>Escolha n8n se você:</p>
        <ul>
          <li>Tem ou pode contratar conhecimento técnico</li>
          <li>Precisa de automações complexas</li>
          <li>Quer controle total dos seus dados</li>
          <li>Busca reduzir custos no longo prazo</li>
        </ul>

        <h2>Conclusão</h2>
        <p>Ambas são ótimas ferramentas. A escolha depende do perfil da sua empresa, orçamento disponível e necessidades técnicas específicas.</p>
      `
    },
    "roi-automacao-calcular-retorno": {
      title: "ROI da automação: Como calcular o retorno do investimento",
      category: "Produtividade",
      readTime: "4 min",
      date: "5 Jan 2024",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      content: `
        <p>Entenda como medir o retorno do investimento das suas iniciativas de automação e justificar novos projetos.</p>

        <h2>Métricas essenciais para acompanhar</h2>
        <ul>
          <li><strong>Tempo economizado:</strong> Horas/semana que a equipe deixou de gastar</li>
          <li><strong>Redução de erros:</strong> Diminuição de retrabalho e correções</li>
          <li><strong>Aumento de capacidade:</strong> Mais clientes atendidos com mesma equipe</li>
          <li><strong>Satisfação do cliente:</strong> NPS e outras métricas de experiência</li>
        </ul>

        <h2>Fórmula básica do ROI</h2>
        <p>ROI = (Ganhos - Custos) / Custos x 100</p>
        <p>Onde:</p>
        <ul>
          <li>Ganhos = Economia de tempo + Aumento de receita + Redução de erros</li>
          <li>Custos = Investimento inicial + Custos mensais + Treinamento</li>
        </ul>

        <h2>Exemplo prático</h2>
        <p>Empresa que automatizou atendimento:</p>
        <ul>
          <li>Investimento: R$ 5.000 (setup) + R$ 500/mês</li>
          <li>Economia: 40h/mês de equipe = R$ 2.000</li>
          <li>Aumento de vendas: 15% = R$ 3.000/mês</li>
          <li>ROI no primeiro ano: 900%</li>
        </ul>

        <h2>Dicas para maximizar ROI</h2>
        <ol>
          <li>Comece com processos de alto impacto</li>
          <li>Meça antes e depois com rigor</li>
          <li>Ajuste e otimize continuamente</li>
          <li>Documente ganhos intangíveis</li>
        </ol>

        <h2>Conclusão</h2>
        <p>A automação quase sempre se paga em poucos meses. O segredo é escolher os processos certos e medir os resultados adequadamente.</p>
      `
    },
    "chatbots-inteligentes-respostas-automaticas": {
      title: "Chatbots inteligentes: Além das respostas automáticas",
      category: "IA & Chatbots",
      readTime: "6 min",
      date: "3 Jan 2024",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&h=600&fit=crop",
      content: `
        <p>Chatbots modernos vão muito além de respostas automáticas. Descubra como criar assistentes virtuais que realmente agregam valor.</p>

        <h2>O que diferencia um chatbot inteligente</h2>
        <ul>
          <li>Compreensão de contexto e intenção</li>
          <li>Personalização baseada em histórico</li>
          <li>Aprendizado contínuo com interações</li>
          <li>Integração com sistemas internos</li>
        </ul>

        <h2>Casos de uso avançados</h2>
        <p><strong>Vendas consultivas:</strong></p>
        <p>O chatbot faz perguntas qualificadoras e recomenda produtos específicos baseado nas necessidades do cliente.</p>

        <p><strong>Suporte técnico inteligente:</strong></p>
        <p>Diagnóstico de problemas através de perguntas direcionadas e resolução passo a passo.</p>

        <p><strong>Onboarding de clientes:</strong></p>
        <p>Guiar novos usuários através dos recursos do produto de forma personalizada.</p>

        <h2>Como criar um chatbot que funciona</h2>
        <ol>
          <li>Mapeie as jornadas mais comuns dos usuários</li>
          <li>Desenvolva uma personalidade consistente</li>
          <li>Prepare respostas para cenários complexos</li>
          <li>Tenha sempre uma saída para atendimento humano</li>
          <li>Teste exaustivamente antes de lançar</li>
        </ol>

        <h2>Erros comuns a evitar</h2>
        <ul>
          <li>Chatbot que tenta fazer tudo sozinho</li>
          <li>Respostas genéricas demais</li>
          <li>Dificuldade para falar com humano</li>
          <li>Não aprender com interações passadas</li>
        </ul>

        <h2>Conclusão</h2>
        <p>Um chatbot bem implementado é um membro valioso da equipe, não apenas uma ferramenta. Invista tempo no planejamento e colha os frutos no longo prazo.</p>
      `
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
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
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
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
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
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
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
