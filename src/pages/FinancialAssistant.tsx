import { Check, TrendingUp, DollarSign, Target, Shield, Zap, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import agenteFinanceiro from "@/assets/agente_financeiro.png";
import { useNavigate } from "react-router-dom";

const FinancialAssistant = () => {
  const navigate = useNavigate();
  const benefits = [
    {
      icon: "💰",
      title: "Economize até R$ 666/ano",
      description: "Diferença entre poupança e investimento inteligente (em R$ 10 mil)"
    },
    {
      icon: "⏱️",
      title: "Respostas em segundos",
      description: "Sem filas, sem agendamentos, disponível quando você precisar"
    },
    {
      icon: "📊",
      title: "Decisões baseadas em dados reais",
      description: "Não é achismo, são números do mercado brasileiro de 2025"
    },
    {
      icon: "🎯",
      title: "Plano de ação personalizado",
      description: "Do diagnóstico à execução, tudo adaptado ao seu perfil"
    },
    {
      icon: "🔒",
      title: "Privacidade total",
      description: "Suas informações financeiras ficam apenas entre você e o agente"
    }
  ];

  const investments = [
    { name: "LCI 95% CDI", value: 11368, gain: 1368, emoji: "💰", best: true },
    { name: "CDB 110% CDI", value: 11306, gain: 1306, emoji: "🏦", best: false },
    { name: "Tesouro Selic", value: 11229, gain: 1229, emoji: "🏛️", best: false },
    { name: "Fundo DI", value: 11104, gain: 1104, emoji: "📈", best: false },
    { name: "Poupança", value: 10702, gain: 702, emoji: "🐷", best: false }
  ];

  const method502030 = [
    {
      income: "R$ 3.000",
      essentials: "R$ 1.500",
      leisure: "R$ 900",
      invest: "R$ 600",
      color: "from-green-500/20 to-green-500/5"
    },
    {
      income: "R$ 5.000",
      essentials: "R$ 2.500",
      leisure: "R$ 1.500",
      invest: "R$ 1.000",
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      income: "R$ 10.000",
      essentials: "R$ 5.000",
      leisure: "R$ 3.000",
      invest: "R$ 2.000",
      color: "from-purple-500/20 to-purple-500/5"
    }
  ];

  const incomePlans = [
    {
      range: "🟢 INICIANTE PF",
      subtitle: "Até R$ 10k patrimônio",
      priority: "Organização + Reserva + Primeiros investimentos",
      products: "Nubank, CDB 100% CDI, Tesouro Selic",
      focus: "Foco: Organização básica e primeiros investimentos",
      color: "from-green-500/20 to-green-500/5"
    },
    {
      range: "🟡 CRESCIMENTO PF",
      subtitle: "R$ 10k a R$ 100k",
      priority: "Diversificação + Otimização + Metas",
      products: "ETFs (IVVB11, BOVA11), Tesouro IPCA+, Previdência, FIIs",
      focus: "Foco: Diversificação e otimização patrimonial",
      color: "from-yellow-500/20 to-yellow-500/5"
    },
    {
      range: "🔵 CONSOLIDADO PF",
      subtitle: "Acima de R$ 100k",
      priority: "Sofisticação + Proteção patrimonial",
      products: "Multimercados premium, Private Banking, estruturas complexas",
      focus: "Foco: Sofisticação e proteção patrimonial",
      color: "from-blue-500/20 to-blue-500/5"
    }
  ];

  const apps = [
    { name: "Mobills", rating: 5, price: "R$ 9,90/mês", bestFor: "Completo e robusto" },
    { name: "Organizze", rating: 5, price: "R$ 7,90/mês", bestFor: "Sincronização bancária" },
    { name: "Minhas Economias", rating: 4, price: "Grátis", bestFor: "Iniciantes" },
    { name: "GuiaBolso", rating: 4, price: "Grátis", bestFor: "Análise crédito" },
    { name: "Spendee", rating: 5, price: "R$ 12/mês", bestFor: "Visual e intuitivo" },
    { name: "Toshl Finance", rating: 4, price: "R$ 15/mês", bestFor: "Gamificação" },
    { name: "Wallet", rating: 4, price: "R$ 6/mês", bestFor: "Minimalista" },
    { name: "Poupy", rating: 3, price: "Grátis", bestFor: "Simplicidade" },
    { name: "Olivia", rating: 4, price: "Grátis", bestFor: "IA e praticidade" },
    { name: "Monefy", rating: 4, price: "R$ 10/mês", bestFor: "Rapidez" }
  ];

  const commonErrors = [
    {
      error: "Deixar dinheiro na poupança",
      solution: "Migre para Tesouro Selic - rende 60% mais"
    },
    {
      error: "Investir sem reserva de emergência",
      solution: "Primeiro 6 meses de despesas guardados, depois investe"
    },
    {
      error: "Não controlar gastos mensalmente",
      solution: "Use app de controle financeiro - 15 min por semana"
    },
    {
      error: "Parcelar demais no cartão",
      solution: "Máximo 30% da renda comprometida"
    },
    {
      error: "Investir por 'dica' de amigos",
      solution: "Eduque-se primeiro, invista depois"
    },
    {
      error: "Misturar finanças PF e PJ",
      solution: "Contas separadas sempre - pró-labore fixo"
    },
    {
      error: "Ignorar inflação nos investimentos",
      solution: "Rentabilidade real (descontada inflação) é o que importa"
    },
    {
      error: "Não planejar aposentadoria cedo",
      solution: "INSS não será suficiente - previdência privada é essencial"
    },
    {
      error: "Usar rotativo do cartão ou cheque especial",
      solution: "Juros de 150-400% a.a. - renegocie sempre"
    },
    {
      error: "Não diversificar investimentos",
      solution: "Não coloque todos os ovos na mesma cesta"
    }
  ];

  const glossary = [
    { term: "CDI (Certificado de Depósito Interbancário)", definition: "Principal taxa de referência para investimentos de renda fixa no Brasil. Hoje está em ~10,50% ao ano." },
    { term: "Selic (Taxa Básica de Juros)", definition: "Taxa definida pelo Banco Central que influencia todos os juros do país. Hoje está em 10,75% ao ano." },
    { term: "CDB (Certificado de Depósito Bancário)", definition: "Empréstimo que você faz ao banco. Retorno: 100-130% do CDI. Protegido pelo FGC até R$ 250 mil." },
    { term: "Tesouro Direto", definition: "Emprestar dinheiro para o governo federal. 3 tipos: Selic (liquidez), IPCA+ (inflação), Prefixado (taxa fixa)." },
    { term: "Renda Variável", definition: "Investimentos cujo retorno não é garantido: ações, fundos imobiliários (FIIs), ETFs." },
    { term: "ETF (Exchange Traded Fund)", definition: "\"Cesta\" de ações que você compra de uma vez. Ex: BOVA11 (Ibovespa), IVVB11 (S&P 500)." },
    { term: "FGC (Fundo Garantidor de Créditos)", definition: "Seguro que protege até R$ 250 mil por CPF em investimentos como CDB, LCI, LCA." },
    { term: "Perfil de Investidor", definition: "Conservador (só RF), Moderado (RF + RV equilibrado), Arrojado (mais RV)." },
    { term: "Reserva de Emergência", definition: "3-6 meses de gastos guardados em investimento líquido (Tesouro Selic, CDB com liquidez diária)." },
    { term: "Liquidez", definition: "Facilidade de transformar investimento em dinheiro na mão. Alta = rápido. Baixa = demora." },
    { term: "Ações", definition: "Parcela de uma empresa que você compra e se torna sócio" },
    { term: "Ibovespa", definition: "Índice da bolsa brasileira - média das principais ações" },
    { term: "LCI/LCA", definition: "Letras de crédito imobiliário/agrícola - isentas de IR" },
    { term: "Renda Fixa", definition: "Investimentos com rentabilidade previsível (Tesouro, CDB)" },
    { term: "PGBL/VGBL", definition: "Planos de previdência privada com benefícios fiscais" }
  ];

  const stats = [
    { label: "Não têm reserva de emergência", value: "43%" },
    { label: "Gastam mais do que ganham", value: "40%" },
    { label: "Entendem POUCO de finanças", value: "76%" },
    { label: "Planejam finanças mensalmente", value: "64%" },
    { label: "Taxa Selic atual (nov 2025)", value: "10,75%" },
    { label: "Taxa CDI atual", value: "10,50%" },
    { label: "Usuários mobile banking", value: "70M+" },
    { label: "Inadimplência fintechs", value: "9,5%" }
  ];

  const perfectFor = [
    "Quem quer sair das dívidas de uma vez por todas",
    "Quem precisa criar uma reserva de emergência",
    "Iniciantes que querem começar a investir",
    "Quem já investe e quer otimizar a carteira",
    "Empreendedores que misturam finanças PF e PJ"
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Financial Assistant Premium - <span className="text-primary">Score Patrimonial 0-100</span>
                </h1>
                <p className="text-lg font-semibold text-primary/80 mb-6">
                  Score Patrimonial 0-100 | Análise em 60 segundos | Compliance Integrado
                </p>
                <p className="text-xl text-muted-foreground mb-8">
                  Transforme sua relação com o dinheiro: organize finanças, invista com inteligência e conquiste seus objetivos financeiros.
                </p>
                <Button size="lg" className="text-lg" onClick={() => navigate('/pricing')}>
                  🚀 DESCOBRIR MEU SCORE PATRIMONIAL AGORA
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

            {/* Metodologia Smart Finance Analysis */}
            <Card className="mb-16 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">🔬 Metodologia Smart Finance Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg font-semibold">
                  Única IA que calcula seu Score Patrimonial baseado em 5 pilares:
                </p>
                <div className="grid gap-4">
                  <div className="flex gap-3 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-2xl">💧</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Liquidez (25%)</h4>
                      <p className="text-muted-foreground">Reserva de emergência vs gastos mensais</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Diversificação (20%)</h4>
                      <p className="text-muted-foreground">Quantidade de tipos de ativos diferentes</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Proteção (20%)</h4>
                      <p className="text-muted-foreground">Renda Fixa + Seguros + Previdência</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-2xl">📈</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Crescimento (20%)</h4>
                      <p className="text-muted-foreground">Renda Variável + Investimentos</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-4 rounded-lg bg-background/50 border border-border">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Planejamento (15%)</h4>
                      <p className="text-muted-foreground">Metas definidas + Aportes regulares</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                  <p className="font-semibold text-lg">
                    <span className="text-primary">Resultado:</span> Classificação automática + Plano de ação personalizado
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Casos Familiares Específicos */}
            <Card className="mb-16 bg-gradient-to-br from-primary/5 to-background border-2">
              <CardHeader>
                <CardTitle className="text-3xl">🏠 Casos Familiares Específicos</CardTitle>
                <CardDescription className="text-base">
                  Soluções personalizadas para cada fase da sua vida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border hover:border-primary/50 transition-colors">
                    <span className="text-3xl">👫</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">PLANEJAMENTO CASAL</h4>
                      <p className="text-muted-foreground">
                        Organização financeira conjunta + Metas compartilhadas + Declaração IRPF otimizada
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border hover:border-primary/50 transition-colors">
                    <span className="text-3xl">👶</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">EDUCAÇÃO FILHOS</h4>
                      <p className="text-muted-foreground">
                        Cálculo automático: R$ 150-300k necessários por filho para ensino superior
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border hover:border-primary/50 transition-colors">
                    <span className="text-3xl">🏡</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">CASA PRÓPRIA</h4>
                      <p className="text-muted-foreground">
                        Análise completa: Financiamento vs. Aluguel + Investimento da diferença
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border hover:border-primary/50 transition-colors">
                    <span className="text-3xl">✈️</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">OBJETIVOS PESSOAIS</h4>
                      <p className="text-muted-foreground">
                        Viagem dos sonhos, carro novo, MBA - Planejamento específico com prazos realistas
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border hover:border-primary/50 transition-colors">
                    <span className="text-3xl">💼</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">APOSENTADORIA INTELIGENTE</h4>
                      <p className="text-muted-foreground">
                        Regra 25x: Patrimônio necessário + Estratégias PGBL/VGBL otimizadas
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Produtos Priorizados 2025 */}
            <Card className="mb-16 bg-gradient-to-br from-green-500/5 to-background border-2">
              <CardHeader>
                <CardTitle className="text-3xl">💰 Produtos Priorizados 2025 - Pessoas Físicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  {/* Iniciante PF */}
                  <div className="p-6 rounded-lg bg-background border-2 border-green-500/30">
                    <h4 className="font-bold text-xl mb-4 text-green-700 dark:text-green-400">🔰 INICIANTE PF:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>Nubank</strong> (conta + cartão sem tarifas, cashback 1%)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>CDB 100% CDI</strong> (proteção FGC, sem IR até R$ 35k/ano)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>Tesouro Selic</strong> (liquidez diária, 100% Selic)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Crescimento PF */}
                  <div className="p-6 rounded-lg bg-background border-2 border-yellow-500/30">
                    <h4 className="font-bold text-xl mb-4 text-yellow-700 dark:text-yellow-400">📈 CRESCIMENTO PF:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-yellow-600 dark:text-yellow-400">•</span>
                        <span><strong>IVVB11 - ETF S&P 500</strong> (diversificação internacional)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-yellow-600 dark:text-yellow-400">•</span>
                        <span><strong>BOVA11 - ETF Ibovespa</strong> (ações brasileiras)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-yellow-600 dark:text-yellow-400">•</span>
                        <span><strong>Tesouro IPCA+ 2029</strong> (6,0% + inflação garantida)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Consolidado PF */}
                  <div className="p-6 rounded-lg bg-background border-2 border-blue-500/30">
                    <h4 className="font-bold text-xl mb-4 text-blue-700 dark:text-blue-400">🏆 CONSOLIDADO PF:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <span><strong>FIIs diversificados</strong> (HGLG11, XPML11, KNRI11 - renda passiva)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <span><strong>Multimercados premium</strong> (8-12% a.a. histórico)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <span><strong>Private Banking</strong> (XP Private, BTG Wealth)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
                  <p className="font-semibold">
                    <span className="text-primary">Base atualizada 2025:</span> Selic 10,75% | CDI 10,50% | Inflação 4,5%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-lg text-muted-foreground">
                Imagine ter um especialista financeiro disponível 24/7, conhecedor profundo do mercado brasileiro, pronto para te guiar em cada decisão sobre seu dinheiro. O <strong>Financial Assistant Premium</strong> é isso e muito mais.
              </p>
            </div>

            {/* Diferenciais Únicos: Memória e Empatia */}
            <Card className="mb-16 border-2 border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full">
                    EXCLUSIVO
                  </span>
                </div>
                <CardTitle className="text-2xl">O Diferencial: Memória e Empatia</CardTitle>
                <CardDescription>Não é só IA, é inteligência emocional aplicada às suas finanças</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Sistema de Memória Conversacional
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      O agente lembra de tudo que você contou antes. Nunca vai perguntar sua renda de novo, nem esquecer seus objetivos. A cada conversa, ele fica mais personalizado.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Comunicação Empática (3 Passos)
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>1️⃣ <strong>Acolhe</strong> sua situação atual (sem julgamentos)</li>
                      <li>2️⃣ <strong>Explica</strong> o problema de forma simples</li>
                      <li>3️⃣ <strong>Propõe</strong> ação concreta e viável</li>
                    </ul>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground italic">
                  "Mais do que números, ele entende você."
                </p>
              </CardContent>
            </Card>

            {/* Números Reais: Comparação de Investimentos */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">Números Reais: Veja Quanto Você Ganha</h2>
              <p className="text-muted-foreground mb-8">
                R$ 10.000 aplicados por 1 ano em cada opção (dados de novembro 2025):
              </p>
              <div className="grid gap-4">
                {investments.map((inv, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      inv.best
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{inv.emoji}</span>
                        <div>
                          <h3 className="font-bold text-lg">{inv.name}</h3>
                          {inv.best && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">
                              MELHOR OPÇÃO
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          R$ {inv.value.toLocaleString('pt-BR')}
                        </div>
                        <div className={`text-sm ${inv.best ? 'text-primary' : 'text-muted-foreground'}`}>
                          Ganho: R$ {inv.gain.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Dados de mercado:</strong> Selic 10,75% a.a. | CDI 10,50% a.a. | Inflação projetada ~4,5% a.a.
                </p>
              </div>
            </div>

            {/* Método 50-30-20 Expandido */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">Método 50-30-20: Organize Suas Finanças</h2>
              <p className="text-muted-foreground mb-8">
                A regra de ouro: <strong>50% necessidades</strong> + <strong>30% desejos</strong> + <strong>20% futuro</strong>
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {method502030.map((plan, index) => (
                  <Card key={index} className={`bg-gradient-to-br ${plan.color} border-2`}>
                    <CardHeader>
                      <CardTitle className="text-xl">Renda: {plan.income}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">50% Essenciais</div>
                        <div className="text-2xl font-bold text-foreground">{plan.essentials}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Aluguel, contas, alimentação, transporte
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">30% Lazer</div>
                        <div className="text-2xl font-bold text-foreground">{plan.leisure}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Restaurantes, streaming, hobbies
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">20% Investir</div>
                        <div className="text-2xl font-bold text-primary">{plan.invest}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Reserva, aposentadoria, investimentos
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Segmentação por Patrimônio */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">🎯 Segmentação Inteligente por Patrimônio</h2>
              <p className="text-muted-foreground mb-8">
                Estratégias específicas para cada nível patrimonial
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {incomePlans.map((plan, index) => (
                  <Card key={index} className={`bg-gradient-to-br ${plan.color} border-2`}>
                    <CardHeader>
                      <CardTitle className="text-xl">{plan.range}</CardTitle>
                      <CardDescription className="text-base font-semibold text-foreground">
                        {plan.subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Foco</div>
                        <div className="font-bold text-sm">{plan.priority}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Produtos</div>
                        <div className="text-sm leading-relaxed">{plan.products}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Estratégias de Quitação de Dívidas */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">Estratégias de Quitação de Dívidas</h2>
              <p className="text-muted-foreground mb-8">
                Dois métodos comprovados para sair do vermelho
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>⛷️</span> Método Bola de Neve
                    </CardTitle>
                    <CardDescription>Vitórias rápidas que motivam</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-bold mb-2">Como funciona:</h4>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Liste dívidas da menor para a maior</li>
                        <li>Pague o mínimo de todas</li>
                        <li>Ataque a menor com força total</li>
                        <li>Quitou? Passa para a próxima</li>
                      </ol>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="text-sm font-bold text-green-700 dark:text-green-400">
                        Melhor para quem precisa de motivação
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>🎯</span> Método Avalanche
                    </CardTitle>
                    <CardDescription>Economiza mais em juros</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-bold mb-2">Como funciona:</h4>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Liste dívidas da maior para menor taxa de juros</li>
                        <li>Pague o mínimo de todas</li>
                        <li>Ataque a de maior juros com força total</li>
                        <li>Quitou? Passa para a próxima</li>
                      </ol>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <div className="text-sm font-bold text-blue-700 dark:text-blue-400">
                        Melhor para quem é disciplinado
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Priorize SEMPRE nesta ordem:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <div className="font-bold">1. Cheque Especial</div>
                        <div className="text-sm text-muted-foreground">150% a.a. - Mate antes que te mate</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <div className="font-bold">2. Rotativo do Cartão</div>
                        <div className="text-sm text-muted-foreground">400% a.a. - Nunca, NUNCA use</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <div className="font-bold">3. Empréstimos Pessoais</div>
                        <div className="text-sm text-muted-foreground">80-120% a.a. - Renegocie sempre que possível</div>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Top 10 Apps Expandido */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">Top 10 Apps de Controle Financeiro</h2>
              <p className="text-muted-foreground mb-8">
                Avaliados e testados para o mercado brasileiro
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {apps.map((app, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{app.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < app.rating ? "text-yellow-500" : "text-muted-foreground"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{app.price}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Melhor para:</strong> {app.bestFor}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 10 Erros Comuns */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">10 Erros que Destroem seu Dinheiro (e Como Evitar)</h2>
              <p className="text-muted-foreground mb-8">
                Aprenda com os erros mais comuns dos brasileiros
              </p>
              <Accordion type="single" collapsible className="w-full">
                {commonErrors.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center gap-3">
                        <span className="text-destructive">❌</span>
                        <span>{item.error}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-9 text-muted-foreground">
                        <span className="text-primary font-bold">✓ Solução:</span> {item.solution}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Guia de IR 2025 Expandido */}
            <Card className="mb-16">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Guia Completo de IR 2025
                </CardTitle>
                <CardDescription>Tudo que você precisa saber sobre Imposto de Renda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-2">Quem deve declarar:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Renda acima de R$ 30.639,90/ano</li>
                      <li>• Bens acima de R$ 800 mil</li>
                      <li>• Operações na bolsa</li>
                      <li>• Vendeu imóvel</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Principais deduções:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Despesas médicas (sem limite)</li>
                      <li>• Educação (até R$ 3.561,50 por pessoa)</li>
                      <li>• INSS (100% dedutível)</li>
                      <li>• Dependentes (R$ 2.275,08 cada)</li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <h4 className="font-bold mb-2 text-primary">✨ Novidade 2026:</h4>
                  <p className="text-sm text-muted-foreground">
                    Isenção de IR para quem ganha até <strong>R$ 5.000/mês</strong> (R$ 60 mil/ano)
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-muted-foreground">Prazo:</span> <strong>31 de março a 30 de maio</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Multa atraso:</span> <strong className="text-destructive">Mínimo R$ 165,74</strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Melhorados */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Dados da Realidade Brasileira</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Glossário Financeiro */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-2">Glossário Financeiro</h2>
              <p className="text-muted-foreground mb-8">
                Entenda os termos mais importantes do mercado
              </p>
              <Accordion type="single" collapsible className="w-full">
                {glossary.map((item, index) => (
                  <AccordionItem key={index} value={`glossary-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-bold">{item.term}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-muted-foreground">
                        {item.definition}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Perfeito Para */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Perfeito para:</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {perfectFor.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Por Que Escolher Este Assistente</h2>
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

            {/* Compliance Integrado */}
            <Card className="mb-16 bg-gradient-to-br from-blue-500/5 to-background border-2 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-3xl">🛡️ Compliance Integrado - Segurança Máxima</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border">
                    <span className="text-3xl">⚖️</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">REGULAMENTAÇÃO</h4>
                      <p className="text-muted-foreground">
                        Conformidade total com CVM e políticas financeiras brasileiras
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border">
                    <span className="text-3xl">📋</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">DISCLAIMERS AUTOMÁTICOS</h4>
                      <p className="text-muted-foreground">
                        Proteção legal integrada em todas as recomendações
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border">
                    <span className="text-3xl">🎯</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">LIMITAÇÕES CLARAS</h4>
                      <p className="text-muted-foreground">
                        Consultoria educativa, não substitui planejamento personalizado
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border">
                    <span className="text-3xl">🔒</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">PRIVACIDADE GARANTIDA</h4>
                      <p className="text-muted-foreground">
                        Dados financeiros pessoais 100% protegidos e não compartilhados
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-lg bg-background border-2 border-border">
                    <span className="text-3xl">💼</span>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">IDEAL PARA B2B</h4>
                      <p className="text-muted-foreground">
                        Fintechs e consultorias que precisam de conformidade regulatória integrada
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                  <p className="text-sm text-muted-foreground italic">
                    *Desenvolvido com metodologia própria para escalabilidade comercial*
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CTA Final */}
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Seu Futuro Financeiro Começa Agora
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Não deixe seu dinheiro parado. Transforme suas finanças hoje.
              </p>
              <Button size="lg" className="text-lg" onClick={() => navigate('/pricing')}>
                🚀 DESCOBRIR MEU SCORE PATRIMONIAL AGORA
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialAssistant;
