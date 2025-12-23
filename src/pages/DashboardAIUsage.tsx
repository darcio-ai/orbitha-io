import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { Activity, DollarSign, Zap, Clock, TrendingUp, Users, Wallet, AlertCircle, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UsageLog {
  id: string;
  user_id: string | null;
  agent_id: string | null;
  function_name: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
  duration_ms: number | null;
  created_at: string;
}

interface DailyUsage {
  date: string;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  requests: number;
}

interface ModelUsage {
  model: string;
  tokens: number;
  cost: number;
  requests: number;
}

interface OpenAIBalance {
  hasApiKey: boolean;
  hasBillingAccess: boolean;
  currentMonthCost?: number;
  costsByModel?: Record<string, number>;
  costsByProject?: Record<string, number>;
  periodStart?: string;
  periodEnd?: string;
  message?: string;
  error?: string;
  source?: string;
  pagesProcessed?: number;
  bucketsProcessed?: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const USD_TO_BRL = 5.5; // Approximate exchange rate
const CREDIT_LIMIT_KEY = 'openai_credit_limit';
const INITIAL_CREDIT_KEY = 'openai_initial_credit';

const DashboardAIUsage = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [period, setPeriod] = useState("7");
  const [functionFilter, setFunctionFilter] = useState("all");
  const [openaiBalance, setOpenaiBalance] = useState<OpenAIBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [creditLimit, setCreditLimit] = useState<number>(() => {
    const saved = localStorage.getItem(CREDIT_LIMIT_KEY);
    return saved ? parseFloat(saved) : 100;
  });
  const [initialCredit, setInitialCredit] = useState<number>(() => {
    const saved = localStorage.getItem(INITIAL_CREDIT_KEY);
    return saved ? parseFloat(saved) : 0;
  });
  const [editingLimit, setEditingLimit] = useState(false);
  const [editingInitialCredit, setEditingInitialCredit] = useState(false);
  const [tempLimit, setTempLimit] = useState(creditLimit.toString());
  const [tempInitialCredit, setTempInitialCredit] = useState(initialCredit.toString());

  useEffect(() => {
    fetchLogs();
    fetchOpenAIBalance();
  }, [period, functionFilter]);

  const fetchOpenAIBalance = async () => {
    setLoadingBalance(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session for OpenAI balance fetch');
        setLoadingBalance(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-openai-balance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      console.log('OpenAI balance response:', data);
      setOpenaiBalance(data);
    } catch (error) {
      console.error('Error fetching OpenAI balance:', error);
      setOpenaiBalance({ hasApiKey: false, hasBillingAccess: false, error: 'Failed to fetch' });
    } finally {
      setLoadingBalance(false);
    }
  };

  const saveCreditLimit = () => {
    const newLimit = parseFloat(tempLimit);
    if (isNaN(newLimit) || newLimit <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor maior que zero.",
        variant: "destructive",
      });
      return;
    }
    setCreditLimit(newLimit);
    localStorage.setItem(CREDIT_LIMIT_KEY, newLimit.toString());
    setEditingLimit(false);
    toast({
      title: "Limite atualizado",
      description: `Novo limite de créditos: $${newLimit.toFixed(2)}`,
    });
  };

  const saveInitialCredit = () => {
    const newCredit = parseFloat(tempInitialCredit);
    if (isNaN(newCredit) || newCredit < 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      });
      return;
    }
    setInitialCredit(newCredit);
    localStorage.setItem(INITIAL_CREDIT_KEY, newCredit.toString());
    setEditingInitialCredit(false);
    toast({
      title: "Crédito inicial atualizado",
      description: `Novo crédito inicial: $${newCredit.toFixed(2)}`,
    });
  };


  const fetchLogs = async () => {
    setLoading(true);
    try {
      const days = parseInt(period);
      const startDate = startOfDay(subDays(new Date(), days));
      
      let query = supabase
        .from('ai_usage_logs')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (functionFilter !== 'all') {
        query = query.eq('function_name', functionFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching AI usage logs:', error);
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics
  const totalTokens = logs.reduce((sum, log) => sum + (log.total_tokens || 0), 0);
  const totalPromptTokens = logs.reduce((sum, log) => sum + log.prompt_tokens, 0);
  const totalCompletionTokens = logs.reduce((sum, log) => sum + log.completion_tokens, 0);
  const totalCostUSD = logs.reduce((sum, log) => sum + Number(log.estimated_cost_usd), 0);
  const totalCostBRL = totalCostUSD * USD_TO_BRL;
  const avgTokensPerRequest = logs.length > 0 ? Math.round(totalTokens / logs.length) : 0;
  const avgDuration = logs.length > 0 
    ? Math.round(logs.reduce((sum, log) => sum + (log.duration_ms || 0), 0) / logs.length)
    : 0;

  // Calculate real cost from OpenAI API or use estimated
  const realOpenAICost = openaiBalance?.hasBillingAccess ? (openaiBalance.currentMonthCost || 0) : null;
  const displayCost = realOpenAICost !== null ? realOpenAICost : totalCostUSD;
  const isRealCost = realOpenAICost !== null;
  
  // Calculate estimated balance
  const estimatedBalance = initialCredit > 0 ? Math.max(0, initialCredit - displayCost) : null;
  const usagePercentage = initialCredit > 0 ? Math.min(100, (displayCost / initialCredit) * 100) : (totalCostUSD / creditLimit) * 100;

  // Calculate daily usage
  const dailyUsage: DailyUsage[] = [];
  const dailyMap = new Map<string, DailyUsage>();
  
  logs.forEach(log => {
    const date = format(new Date(log.created_at), 'yyyy-MM-dd');
    const existing = dailyMap.get(date) || {
      date,
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      cost: 0,
      requests: 0,
    };
    
    existing.totalTokens += log.total_tokens || 0;
    existing.promptTokens += log.prompt_tokens;
    existing.completionTokens += log.completion_tokens;
    existing.cost += Number(log.estimated_cost_usd);
    existing.requests += 1;
    
    dailyMap.set(date, existing);
  });

  dailyMap.forEach(value => dailyUsage.push(value));
  dailyUsage.sort((a, b) => a.date.localeCompare(b.date));

  // Format daily data for chart
  const dailyChartData = dailyUsage.map(d => ({
    ...d,
    date: format(new Date(d.date), 'dd/MM', { locale: ptBR }),
    cost: Number(d.cost.toFixed(4)),
  }));

  // Calculate model usage
  const modelMap = new Map<string, ModelUsage>();
  logs.forEach(log => {
    const existing = modelMap.get(log.model) || {
      model: log.model,
      tokens: 0,
      cost: 0,
      requests: 0,
    };
    
    existing.tokens += log.total_tokens || 0;
    existing.cost += Number(log.estimated_cost_usd);
    existing.requests += 1;
    
    modelMap.set(log.model, existing);
  });

  const modelUsage = Array.from(modelMap.values())
    .sort((a, b) => b.cost - a.cost);

  // Calculate function usage
  const functionMap = new Map<string, { name: string; requests: number; tokens: number; cost: number }>();
  logs.forEach(log => {
    const existing = functionMap.get(log.function_name) || {
      name: log.function_name,
      requests: 0,
      tokens: 0,
      cost: 0,
    };
    
    existing.requests += 1;
    existing.tokens += log.total_tokens || 0;
    existing.cost += Number(log.estimated_cost_usd);
    
    functionMap.set(log.function_name, existing);
  });

  const functionUsage = Array.from(functionMap.values());

  // Unique users
  const uniqueUsers = new Set(logs.filter(l => l.user_id).map(l => l.user_id)).size;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Uso de IA</h1>
          <p className="text-muted-foreground">Métricas de tokens e custos estimados</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={functionFilter} onValueChange={setFunctionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="chat-agent">Chat Agent</SelectItem>
              <SelectItem value="demo-chat">Demo Chat</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="14">Últimos 14 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Tokens</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPromptTokens.toLocaleString('pt-BR')} prompt / {totalCompletionTokens.toLocaleString('pt-BR')} completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Custo Estimado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCostUSD.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ≈ R$ {totalCostBRL.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Média por Requisição</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTokensPerRequest.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              tokens/req • {logs.length} requisições
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration.toLocaleString('pt-BR')}ms</div>
            <p className="text-xs text-muted-foreground mt-1">
              {uniqueUsers} usuários únicos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* OpenAI Balance Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Saldo OpenAI
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setTempLimit(creditLimit.toString());
              setTempInitialCredit(initialCredit.toString());
              setEditingLimit(!editingLimit);
              setEditingInitialCredit(false);
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loadingBalance ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Settings Editor */}
              {editingLimit && (
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Crédito Inicial:</span>
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={tempInitialCredit}
                      onChange={(e) => setTempInitialCredit(e.target.value)}
                      className="w-24 h-8"
                      placeholder="10.00"
                    />
                    <Button size="sm" onClick={saveInitialCredit}>
                      Salvar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Informe o crédito que você tem disponível na sua conta OpenAI. Isso será usado para calcular o saldo estimado.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Limite de Alerta:</span>
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={tempLimit}
                      onChange={(e) => setTempLimit(e.target.value)}
                      className="w-24 h-8"
                      placeholder="100"
                    />
                    <Button size="sm" onClick={saveCreditLimit}>
                      Salvar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingLimit(false)}>
                      Fechar
                    </Button>
                  </div>
                </div>
              )}

              {/* Balance Display */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Initial Credit */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Crédito Inicial</p>
                  <p className="text-2xl font-bold">
                    {initialCredit > 0 ? `$${initialCredit.toFixed(2)}` : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {initialCredit > 0 ? `≈ R$ ${(initialCredit * USD_TO_BRL).toFixed(2)}` : 'Configure acima'}
                  </p>
                </div>

                {/* Current Month Usage */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-muted-foreground">Gasto este Mês</p>
                    {isRealCost && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-500/30">
                        Real
                      </Badge>
                    )}
                    {!isRealCost && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        Estimado
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-orange-500">
                    ${displayCost.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">≈ R$ {(displayCost * USD_TO_BRL).toFixed(2)}</p>
                </div>

                {/* Estimated Balance */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Saldo Estimado</p>
                  <p className={`text-2xl font-bold ${
                    estimatedBalance !== null 
                      ? (estimatedBalance < initialCredit * 0.2 ? 'text-destructive' : 'text-green-500')
                      : 'text-muted-foreground'
                  }`}>
                    {estimatedBalance !== null ? `$${estimatedBalance.toFixed(2)}` : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {estimatedBalance !== null 
                      ? `≈ R$ ${(estimatedBalance * USD_TO_BRL).toFixed(2)}` 
                      : 'Configure crédito inicial'}
                  </p>
                </div>

                {/* Alert Limit */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Limite de Alerta</p>
                  <p className="text-2xl font-bold">${creditLimit.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">≈ R$ {(creditLimit * USD_TO_BRL).toFixed(2)}</p>
                </div>
              </div>

              {/* Usage Progress Bar */}
              {initialCredit > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Consumo do Crédito</span>
                    <span className={`font-medium ${usagePercentage > 80 ? 'text-destructive' : usagePercentage > 50 ? 'text-orange-500' : 'text-green-500'}`}>
                      {usagePercentage.toFixed(1)}% usado
                    </span>
                  </div>
                  <Progress 
                    value={usagePercentage} 
                    className={`h-3 ${usagePercentage > 80 ? '[&>div]:bg-destructive' : usagePercentage > 50 ? '[&>div]:bg-orange-500' : '[&>div]:bg-green-500'}`}
                  />
                  {usagePercentage > 80 && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Atenção: Mais de 80% do crédito já foi consumido!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback progress for alert limit */}
              {initialCredit === 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uso vs Limite de Alerta</span>
                    <span className={`font-medium ${(totalCostUSD / creditLimit) * 100 > 80 ? 'text-destructive' : ''}`}>
                      {Math.min(100, (totalCostUSD / creditLimit) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(100, (totalCostUSD / creditLimit) * 100)} 
                    className="h-2"
                  />
                </div>
              )}

              {/* OpenAI API Status */}
              {openaiBalance && (
                <div className={`flex items-start gap-2 p-3 rounded-lg ${
                  openaiBalance.hasBillingAccess ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted/50'
                }`}>
                  <AlertCircle className={`h-4 w-4 mt-0.5 ${openaiBalance.hasBillingAccess ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <div className="text-xs">
                    {!openaiBalance.hasApiKey && (
                      <span className="text-muted-foreground">API key não configurada. Os custos são estimados com base nos logs locais.</span>
                    )}
                    {openaiBalance.hasApiKey && !openaiBalance.hasBillingAccess && (
                      <div className="text-muted-foreground">
                        <p>A chave API atual não tem permissão de billing. Os custos são estimados com base nos logs locais.</p>
                        {openaiBalance.message && <p className="mt-1 text-orange-500">{openaiBalance.message}</p>}
                      </div>
                    )}
                    {openaiBalance.hasApiKey && openaiBalance.hasBillingAccess && (
                      <div className="text-green-600">
                        <p className="font-medium">✓ Dados reais da API OpenAI</p>
                        <p className="text-muted-foreground mt-1">
                          Período: {openaiBalance.periodStart ? new Date(openaiBalance.periodStart).toLocaleDateString('pt-BR') : '—'} até {openaiBalance.periodEnd ? new Date(openaiBalance.periodEnd).toLocaleDateString('pt-BR') : '—'}
                          {openaiBalance.pagesProcessed && ` • ${openaiBalance.pagesProcessed} páginas processadas`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Uso ao Longo do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'promptTokens') return [value.toLocaleString('pt-BR'), 'Prompt'];
                      if (name === 'completionTokens') return [value.toLocaleString('pt-BR'), 'Completion'];
                      return [value.toLocaleString('pt-BR'), name];
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="promptTokens" 
                    stackId="1" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.6}
                    name="Prompt"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completionTokens" 
                    stackId="1" 
                    stroke="hsl(var(--chart-2))" 
                    fill="hsl(var(--chart-2))" 
                    fillOpacity={0.6}
                    name="Completion"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost by Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Custo por Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {modelUsage.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={modelUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="cost"
                      nameKey="model"
                    >
                      {modelUsage.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`$${value.toFixed(4)}`, 'Custo']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 w-full lg:w-auto">
                  {modelUsage.slice(0, 5).map((model, index) => (
                    <div key={model.model} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-mono text-xs truncate max-w-32">{model.model}</span>
                      <Badge variant="secondary" className="ml-auto">
                        ${model.cost.toFixed(4)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Function Usage & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage by Function */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Uso por Função
            </CardTitle>
          </CardHeader>
          <CardContent>
            {functionUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={functionUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Requisições']}
                  />
                  <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium">{log.function_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), "dd/MM HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {(log.total_tokens || 0).toLocaleString('pt-BR')} tk
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-xs">
                      ${Number(log.estimated_cost_usd).toFixed(4)}
                    </Badge>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhuma atividade no período
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAIUsage;
