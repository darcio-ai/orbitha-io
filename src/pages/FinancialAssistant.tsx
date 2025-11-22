import { CheckCircle, TrendingUp, Target, Shield, Clock, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import agenteFinanceiro from "@/assets/agente_financeiro.png";
import { useNavigate } from "react-router-dom";

const FinancialAssistant = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Descubra seu <span className="bg-gradient-primary bg-clip-text text-transparent">Score Patrimonial (0–100)</span> e saiba o que fazer nos próximos <span className="text-primary">30/90/12 meses</span> para evoluir seu patrimônio
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Análise completa em 60 segundos. Diagnóstico financeiro + classificação automática + roadmap prático para seus objetivos.
              </p>
              <div className="space-y-4">
                <Button size="lg" className="text-lg px-8 py-6 w-full md:w-auto" onClick={() => navigate('/chat/financial-assistant')}>
                  🚀 Começar minha análise agora (grátis)
                </Button>
                <div>
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => navigate('/pricing')}
                  >
                    Ver planos Premium →
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={agenteFinanceiro}
                alt="Financial Assistant"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* Como Funciona - 3 Passos */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-4">Como funciona</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Simples, rápido e eficiente
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-2">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">💬</span>
                  </div>
                  <CardTitle className="text-xl">Passo 1: Conte sua situação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Responda perguntas rápidas sobre sua renda, despesas, objetivos e situação atual
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">📊</span>
                  </div>
                  <CardTitle className="text-xl">Passo 2: Receba seu Score 0-100</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Classificação automática baseada em 5 pilares financeiros com diagnóstico completo
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <CardTitle className="text-xl">Passo 3: Plano de ação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Roadmap personalizado: 30 dias, 90 dias e 12 meses para conquistar seus objetivos
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Metodologia Smart Finance Analysis */}
          <section className="mb-20">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  🔬 Metodologia Smart Finance Analysis
                </CardTitle>
                <p className="text-center text-muted-foreground mt-2">
                  Seu Score Patrimonial é calculado com base em 5 pilares fundamentais
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-3xl">💧</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-lg">Liquidez</h4>
                        <span className="text-primary font-bold">25%</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Reserva de emergência vs gastos mensais</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-3xl">📊</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-lg">Diversificação</h4>
                        <span className="text-primary font-bold">20%</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Variedade de tipos de ativos na carteira</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-3xl">🛡️</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-lg">Proteção</h4>
                        <span className="text-primary font-bold">20%</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Renda fixa, seguros e previdência</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-3xl">📈</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-lg">Crescimento</h4>
                        <span className="text-primary font-bold">20%</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Renda variável e investimentos de longo prazo</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-3xl">🎯</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-lg">Planejamento</h4>
                        <span className="text-primary font-bold">15%</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Metas definidas e aportes regulares</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/10 rounded-lg border-l-4 border-primary text-center">
                  <p className="font-semibold text-lg">
                    <span className="text-primary">Resultado:</span> Diagnóstico completo + Classificação automática + Plano de ação personalizado
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Casos Familiares Específicos */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-4">🏠 Casos Familiares Específicos</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Soluções personalizadas para cada fase da sua vida
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">👫</span>
                    <CardTitle className="text-lg">Planejamento Casal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Organização financeira conjunta e metas compartilhadas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">👶</span>
                    <CardTitle className="text-lg">Educação dos Filhos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Planejamento para ensino superior e futuro das crianças
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🏡</span>
                    <CardTitle className="text-lg">Casa Própria</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Análise financiamento vs aluguel e investimento
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">✈️</span>
                    <CardTitle className="text-lg">Objetivos Pessoais</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Viagens, carro novo, MBA - planejamento com prazos realistas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">💼</span>
                    <CardTitle className="text-lg">Aposentadoria</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Patrimônio necessário e estratégias de previdência otimizadas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">💰</span>
                    <CardTitle className="text-lg">Gestão de Dívidas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Estratégias eficientes para sair do vermelho rapidamente
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-lg text-muted-foreground mt-8 max-w-3xl mx-auto">
              Em qualquer fase, você recebe um plano claro de prioridades, metas e próximas ações.
            </p>
          </section>

          {/* O que o Premium Entrega */}
          <section className="mb-20">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  ✨ O que o Premium entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">Score Patrimonial 0-100</h4>
                      <p className="text-muted-foreground text-sm">
                        Classificação objetiva baseada nos 5 pilares financeiros
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">Classificação Automática</h4>
                      <p className="text-muted-foreground text-sm">
                        Identifica seu nível patrimonial e recomenda próximos passos
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">Roadmap 30/90/12 meses</h4>
                      <p className="text-muted-foreground text-sm">
                        Plano de ação prático com metas claras e realizáveis
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">Projeções Educativas</h4>
                      <p className="text-muted-foreground text-sm">
                        Cenários conservadores considerando taxas atuais de mercado
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">Memória Conversacional</h4>
                      <p className="text-muted-foreground text-sm">
                        Nunca repete perguntas - lembra de tudo que você compartilhou
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Sugestões por tipo de investimento</h4>
                    <p className="text-muted-foreground text-sm">
                      Mostra caminhos possíveis conforme seu objetivo e prazo (ex.: Tesouro, CDBs, ETFs, FIIs), sempre de forma educativa
                    </p>
                  </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Compliance e Limites */}
          <section className="mb-20">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-muted-foreground" />
                  Compliance e Limites
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  O Financial Assistant Premium oferece <strong>orientação educativa</strong> sobre finanças pessoais e categorias de produtos financeiros disponíveis no mercado brasileiro.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Não é consultor de valores mobiliários</strong> - Não fazemos recomendações individuais de compra ou venda de ativos específicos
                  </li>
                  <li>
                    <strong>Não substitui profissionais certificados</strong> - Para orientações personalizadas, consulte um planejador financeiro CFP® ou contador
                  </li>
                  <li>
                    <strong>Conteúdo educativo</strong> - Todas as informações têm caráter exclusivamente educacional e informativo
                  </li>
                  <li>
                    <strong>Alinhado a boas práticas</strong> - Seguimos princípios de compliance educativo e transparência
                  </li>
                </ul>
                <p className="text-sm italic">
                  As decisões de investimento são sempre de responsabilidade do usuário.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* CTA Final */}
          <section className="text-center mb-20">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-background p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Pronto para transformar suas finanças?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Descubra seu Score Patrimonial em 60 segundos e receba um plano personalizado para alcançar seus objetivos financeiros.
                </p>
                <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/chat/financial-assistant')}>
                  🚀 Começar minha análise agora (grátis)
                </Button>
                <p className="text-sm text-muted-foreground">
                  Sem compromisso • Diagnóstico completo • Resultados imediatos
                </p>
              </div>
            </Card>
          </section>

          {/* Aprenda Mais (Opcional) */}
          <section className="mb-20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-muted-foreground" />
                <h2 className="text-3xl font-bold">Aprenda mais (opcional)</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Conteúdo educativo para você entender melhor e tomar decisões com mais segurança.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {/* Simulações Educativas */}
              <AccordionItem value="simulacoes" className="border-2 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  💰 Simulações educativas de investimentos
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <p className="text-muted-foreground">
                    Exemplos ilustrativos de diferentes categorias de investimentos disponíveis no mercado brasileiro. 
                    Cada tipo tem características próprias de liquidez, proteção e potencial de retorno.
                  </p>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Renda Fixa com Liquidez</CardTitle>
                        <CardDescription>Características: Acesso rápido ao dinheiro, baixo risco</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Exemplos:</strong> Tesouro Selic, CDBs com liquidez diária</p>
                        <p><strong>Para quem:</strong> Reserva de emergência, objetivos de curto prazo</p>
                        <p><strong>Rendimento:</strong> Acompanha a taxa básica de juros do momento</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Renda Fixa com Prazo</CardTitle>
                        <CardDescription>Características: Prazo definido, geralmente rende mais</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Exemplos:</strong> CDBs de banco, LCI/LCA, Tesouro IPCA+</p>
                        <p><strong>Para quem:</strong> Objetivos de médio prazo (2-5 anos)</p>
                        <p><strong>Rendimento:</strong> Percentual do CDI ou inflação + taxa fixa</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Renda Variável - Ações</CardTitle>
                        <CardDescription>Características: Maior potencial, maior oscilação</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Exemplos:</strong> Ações de empresas, fundos de ações, ETFs de índices</p>
                        <p><strong>Para quem:</strong> Objetivos de longo prazo (5+ anos), perfil arrojado</p>
                        <p><strong>Rendimento:</strong> Variável conforme desempenho das empresas/mercado</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Fundos Imobiliários</CardTitle>
                        <CardDescription>Características: Renda passiva mensal, diversificação</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Exemplos:</strong> FIIs de lajes corporativas, shopping, logística</p>
                        <p><strong>Para quem:</strong> Busca renda recorrente, diversificação patrimonial</p>
                        <p><strong>Rendimento:</strong> Distribuição mensal de aluguéis + valorização das cotas</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm">
                      <strong className="text-primary">Importante:</strong> Exemplos educativos. As simulações e retornos variam conforme o cenário de juros atual e seu perfil. 
                      Conteúdo educativo - não substitui consultor CVM/planejador financeiro.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Estratégias de Dívidas */}
              <AccordionItem value="dividas" className="border-2 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  🎯 Estratégias detalhadas para sair das dívidas
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <p className="text-muted-foreground">
                    Dois métodos comprovados internacionalmente para organizar e quitar dívidas de forma eficiente.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span>⛷️</span> Método Bola de Neve
                        </CardTitle>
                        <CardDescription>Vitórias rápidas que motivam a continuar</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-bold mb-2">Como funciona:</h4>
                          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Liste todas as dívidas do menor para o maior valor</li>
                            <li>Pague o valor mínimo de todas as dívidas</li>
                            <li>Todo dinheiro extra vai para a dívida menor</li>
                            <li>Quitou a menor? O valor dela vai para a próxima</li>
                            <li>Repita até quitar todas</li>
                          </ol>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                          <p className="text-sm font-bold text-green-700 dark:text-green-400">
                            ✓ Ideal para quem precisa de motivação
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Vitórias rápidas mantêm você motivado no processo
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span>🎯</span> Método Avalanche
                        </CardTitle>
                        <CardDescription>Economiza mais dinheiro em juros</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-bold mb-2">Como funciona:</h4>
                          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Liste todas as dívidas pela taxa de juros (maior para menor)</li>
                            <li>Pague o valor mínimo de todas as dívidas</li>
                            <li>Todo dinheiro extra vai para a de maior juros</li>
                            <li>Quitou? O valor dela vai para a próxima</li>
                            <li>Repita até quitar todas</li>
                          </ol>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                          <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                            ✓ Ideal para quem é disciplinado
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Economiza mais dinheiro no longo prazo
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-2 border-destructive/30 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        Ordem de Prioridade
                      </CardTitle>
                      <CardDescription>Sempre ataque nesta sequência</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="text-2xl">🔥</span>
                          <div>
                            <div className="font-bold">1. Cheque Especial e Rotativo do Cartão</div>
                            <div className="text-sm text-muted-foreground">Juros extremamente altos - prioridade máxima</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-2xl">⚠️</span>
                          <div>
                            <div className="font-bold">2. Empréstimos Pessoais</div>
                            <div className="text-sm text-muted-foreground">Juros altos - renegocie quando possível</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-2xl">💳</span>
                          <div>
                            <div className="font-bold">3. Parcelas do Cartão</div>
                            <div className="text-sm text-muted-foreground">Controle o limite comprometido</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-2xl">🏠</span>
                          <div>
                            <div className="font-bold">4. Financiamentos</div>
                            <div className="text-sm text-muted-foreground">Juros menores - mantenha em dia</div>
                          </div>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Dica:</strong> Antes de começar qualquer método, negocie todas as dívidas para conseguir melhores condições. 
                      Muitas instituições aceitam descontos para pagamento à vista ou redução de juros para parcelamento.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Guia IRPF */}
              <AccordionItem value="irpf" className="border-2 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  📋 Guia de Imposto de Renda (IRPF)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <p className="text-muted-foreground">
                    Informações gerais sobre a Declaração de Imposto de Renda Pessoa Física no Brasil.
                  </p>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quem é obrigado a declarar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p>Geralmente deve declarar quem se enquadra em um destes critérios:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Recebeu rendimentos tributáveis acima do limite anual definido pela Receita Federal</li>
                        <li>Recebeu rendimentos isentos acima do limite estabelecido</li>
                        <li>Teve ganho de capital na venda de bens ou direitos</li>
                        <li>Realizou operações na bolsa de valores</li>
                        <li>Tinha posse de bens acima do valor estabelecido</li>
                        <li>Passou a residir no Brasil durante o ano</li>
                        <li>Optou pela isenção de IR na venda de imóvel residencial</li>
                      </ul>
                      <p className="pt-2">
                        <strong>Importante:</strong> Os valores e regras específicas são atualizados anualmente pela Receita Federal. 
                        Consulte o site oficial para os limites do ano corrente.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Principais deduções permitidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <div>
                        <p className="font-bold text-foreground mb-1">Despesas médicas</p>
                        <p>Sem limite de valor - inclui consultas, exames, internações, planos de saúde</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground mb-1">Educação</p>
                        <p>Limite anual por pessoa - ensino infantil, fundamental, médio, superior e técnico</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground mb-1">Dependentes</p>
                        <p>Valor fixo anual por dependente declarado</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground mb-1">Previdência privada (PGBL)</p>
                        <p>Até 12% da renda tributável anual</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground mb-1">Pensão alimentícia</p>
                        <p>Valor integral, quando definida judicialmente</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Modelo de declaração</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <div>
                        <p className="font-bold text-foreground mb-1">Declaração Simplificada</p>
                        <p>Desconto padrão automático. Ideal para quem tem poucas deduções.</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground mb-1">Declaração Completa</p>
                        <p>Permite deduzir todas as despesas comprovadas. Ideal para quem tem muitas deduções (saúde, educação, etc).</p>
                      </div>
                      <p className="pt-2">
                        <strong>Dica:</strong> O próprio programa da Receita Federal calcula qual modelo é mais vantajoso para você.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        Mudanças em discussão
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>
                        Propostas de reforma tributária podem alterar regras, limites e faixas de tributação. 
                        Estas mudanças estão em discussão e análise, podendo ser modificadas ou não aprovadas.
                      </p>
                      <p className="mt-2">
                        Sempre consulte o site oficial da Receita Federal para informações atualizadas sobre o ano corrente.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm">
                      <strong className="text-primary">Importante:</strong> Este é um guia educativo geral. 
                      Para situações específicas e complexas, consulte um contador habilitado. 
                      Conteúdo educativo - não substitui orientação contábil profissional.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Apps de Controle */}
              <AccordionItem value="apps" className="border-2 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  📱 Apps de controle financeiro
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <p className="text-muted-foreground">
                    Lista educativa de aplicativos populares no mercado brasileiro para gestão financeira pessoal. 
                    Avalie qual melhor atende suas necessidades.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Mobills</h4>
                        <p className="text-sm text-muted-foreground mb-2">Controle completo e robusto</p>
                        <p className="text-xs text-muted-foreground">Recursos: sincronização bancária, relatórios detalhados, planejamento</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Organizze</h4>
                        <p className="text-sm text-muted-foreground mb-2">Sincronização automática</p>
                        <p className="text-xs text-muted-foreground">Recursos: integração com bancos, categorização automática</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Minhas Economias</h4>
                        <p className="text-sm text-muted-foreground mb-2">Ideal para iniciantes</p>
                        <p className="text-xs text-muted-foreground">Recursos: interface simples, controle básico eficiente</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">GuiaBolso</h4>
                        <p className="text-sm text-muted-foreground mb-2">Análise de crédito</p>
                        <p className="text-xs text-muted-foreground">Recursos: score de crédito, ofertas personalizadas</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Spendee</h4>
                        <p className="text-sm text-muted-foreground mb-2">Visual e intuitivo</p>
                        <p className="text-xs text-muted-foreground">Recursos: design moderno, carteiras compartilhadas</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Wallet</h4>
                        <p className="text-sm text-muted-foreground mb-2">Minimalista</p>
                        <p className="text-xs text-muted-foreground">Recursos: interface limpa, controle essencial</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Olivia</h4>
                        <p className="text-sm text-muted-foreground mb-2">IA e praticidade</p>
                        <p className="text-xs text-muted-foreground">Recursos: assistente virtual, insights automáticos</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Monefy</h4>
                        <p className="text-sm text-muted-foreground mb-2">Rapidez no registro</p>
                        <p className="text-xs text-muted-foreground">Recursos: input rápido, visualização instantânea</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Dica:</strong> Escolha um app e use consistentemente por pelo menos 3 meses. 
                      O mais importante é o hábito de registrar, não qual app você usa. 
                      Muitos oferecem versão gratuita para testar antes de assinar.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Glossário */}
              <AccordionItem value="glossario" className="border-2 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  📚 Glossário financeiro
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <p className="text-muted-foreground mb-6">
                    Termos importantes para entender o mercado financeiro brasileiro.
                  </p>

                  <div className="grid gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">CDI (Certificado de Depósito Interbancário)</h4>
                        <p className="text-sm text-muted-foreground">
                          Principal taxa de referência para investimentos de renda fixa no Brasil. Usada como benchmark para comparar rentabilidade.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Selic (Taxa Básica de Juros)</h4>
                        <p className="text-sm text-muted-foreground">
                          Taxa definida pelo Banco Central que influencia todos os juros da economia brasileira.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">CDB (Certificado de Depósito Bancário)</h4>
                        <p className="text-sm text-muted-foreground">
                          Título de renda fixa emitido por bancos. Protegido pelo FGC até determinado valor por CPF e instituição.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Tesouro Direto</h4>
                        <p className="text-sm text-muted-foreground">
                          Programa que permite comprar títulos públicos do governo federal. Oferece três tipos principais: Selic (liquidez), IPCA+ (inflação), Prefixado (taxa fixa).
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Renda Fixa</h4>
                        <p className="text-sm text-muted-foreground">
                          Investimentos com rentabilidade previsível ou conhecida no momento da aplicação.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Renda Variável</h4>
                        <p className="text-sm text-muted-foreground">
                          Investimentos cujo retorno não é garantido e pode variar: ações, fundos imobiliários (FIIs), ETFs.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">ETF (Exchange Traded Fund)</h4>
                        <p className="text-sm text-muted-foreground">
                          Fundo que replica um índice de mercado. Permite diversificação instantânea comprando uma única cota.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">FGC (Fundo Garantidor de Créditos)</h4>
                        <p className="text-sm text-muted-foreground">
                          Seguro que protege investimentos de renda fixa (como CDB, LCI, LCA) até determinado valor por CPF e instituição.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Perfil de Investidor</h4>
                        <p className="text-sm text-muted-foreground">
                          Classificação baseada em tolerância a risco: Conservador (prioriza segurança), Moderado (equilibra risco e retorno), Arrojado (aceita mais risco por maior potencial).
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Reserva de Emergência</h4>
                        <p className="text-sm text-muted-foreground">
                          Montante equivalente a 3-6 meses de gastos guardados em investimento líquido e seguro para imprevistos.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Liquidez</h4>
                        <p className="text-sm text-muted-foreground">
                          Facilidade de transformar um investimento em dinheiro disponível. Alta liquidez = resgate rápido. Baixa liquidez = pode demorar ou ter custos.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">LCI/LCA</h4>
                        <p className="text-sm text-muted-foreground">
                          Letras de Crédito Imobiliário/Agrícola. Vantagem: isentas de Imposto de Renda para pessoa física.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">PGBL/VGBL</h4>
                        <p className="text-sm text-muted-foreground">
                          Planos de previdência privada. PGBL tem benefício fiscal para quem faz declaração completa do IR. VGBL para quem faz simplificada ou é isento.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Ibovespa</h4>
                        <p className="text-sm text-muted-foreground">
                          Principal índice da bolsa brasileira. Representa a média das ações mais negociadas.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-1">Diversificação</h4>
                        <p className="text-sm text-muted-foreground">
                          Estratégia de distribuir investimentos em diferentes tipos de ativos para reduzir risco.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Dados e Estatísticas */}
              <AccordionItem value="dados" className="border-2 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  📊 Dados e estatísticas do Brasil
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <p className="text-muted-foreground">
                    Dados comportamentais sobre finanças pessoais dos brasileiros baseados em pesquisas de mercado.
                  </p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-red-500/10 to-background border-2 border-red-500/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">43%</div>
                        <p className="text-sm text-muted-foreground">Não têm reserva de emergência</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500/10 to-background border-2 border-orange-500/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">40%</div>
                        <p className="text-sm text-muted-foreground">Gastam mais do que ganham</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500/10 to-background border-2 border-yellow-500/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">76%</div>
                        <p className="text-sm text-muted-foreground">Consideram entender pouco de finanças</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/10 to-background border-2 border-green-500/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">64%</div>
                        <p className="text-sm text-muted-foreground">Planejam finanças mensalmente</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500/10 to-background border-2 border-blue-500/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">70M+</div>
                        <p className="text-sm text-muted-foreground">Usuários de banking digital</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500/10 to-background border-2 border-purple-500/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">~10%</div>
                        <p className="text-sm text-muted-foreground">Taxa de inadimplência média</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Fontes:</strong> Dados compilados de pesquisas públicas de instituições como Anbima, CNC (Confederação Nacional do Comércio), 
                      Serasa e Banco Central do Brasil. Os percentuais representam médias e tendências gerais do comportamento financeiro brasileiro.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </section>
    </div>
  );
};

export default FinancialAssistant;
