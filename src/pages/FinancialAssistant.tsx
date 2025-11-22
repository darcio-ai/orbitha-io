import { CheckCircle, TrendingUp, Target, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
                Descubra seu <span className="bg-gradient-primary bg-clip-text text-transparent">Score Patrimonial</span> e receba um plano de ação personalizado
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Análise completa em 60 segundos. Diagnóstico financeiro + classificação automática + roadmap prático para seus objetivos.
              </p>
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/pricing')}>
                🚀 Descobrir meu Score Patrimonial agora
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
                      <h4 className="font-bold mb-1">Orientação por Categorias</h4>
                      <p className="text-muted-foreground text-sm">
                        Sugere tipos de investimentos adequados ao seu perfil (Tesouro, CDBs, ETFs, FIIs)
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
          <section className="text-center">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-background p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Pronto para transformar suas finanças?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Descubra seu Score Patrimonial em 60 segundos e receba um plano personalizado para alcançar seus objetivos financeiros.
                </p>
                <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/pricing')}>
                  🚀 Descobrir meu Score Patrimonial agora
                </Button>
                <p className="text-sm text-muted-foreground">
                  Sem compromisso • Análise completa • Resultados imediatos
                </p>
              </div>
            </Card>
          </section>
        </div>
      </section>
    </div>
  );
};

export default FinancialAssistant;
