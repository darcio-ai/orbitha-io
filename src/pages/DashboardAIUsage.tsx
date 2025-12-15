import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { Activity, DollarSign, Zap, Clock, TrendingUp, Users } from "lucide-react";

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

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const USD_TO_BRL = 5.5; // Approximate exchange rate

const DashboardAIUsage = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [period, setPeriod] = useState("7");
  const [functionFilter, setFunctionFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, [period, functionFilter]);

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

      {/* Charts Row */}
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
