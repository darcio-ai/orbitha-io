import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, UserPlus, TrendingUp, Globe, Monitor, Smartphone } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { AdminGuard } from "@/components/AdminGuard";

interface AnalyticsData {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgDuration: number;
  dailyData: { date: string; visitors: number; pageviews: number }[];
  topPages: { page: string; views: number }[];
  devices: { device: string; count: number }[];
  countries: { country: string; visitors: number }[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "#10b981", "#f59e0b"];

const DashboardAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersToday, setNewUsersToday] = useState(0);
  const [newUsersWeek, setNewUsersWeek] = useState(0);
  const [usersByDay, setUsersByDay] = useState<{ date: string; users: number }[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Buscar total de usuários
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setTotalUsers(usersCount || 0);

      // Buscar novos usuários hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      setNewUsersToday(todayCount || 0);

      // Buscar novos usuários na última semana
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: weekCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString());

      setNewUsersWeek(weekCount || 0);

      // Buscar cadastros por dia (últimos 14 dias)
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true });

      // Agrupar por dia
      const dayMap = new Map<string, number>();
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        dayMap.set(dateStr, 0);
      }

      profilesData?.forEach((profile) => {
        const date = new Date(profile.created_at);
        const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        if (dayMap.has(dateStr)) {
          dayMap.set(dateStr, (dayMap.get(dateStr) || 0) + 1);
        }
      });

      const dailyUsers = Array.from(dayMap.entries()).map(([date, users]) => ({
        date,
        users,
      }));

      setUsersByDay(dailyUsers);
    } catch (error) {
      console.error("Erro ao buscar analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Métricas de acesso e cadastros para o lançamento</p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">cadastrados na plataforma</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Novos Hoje
              </CardTitle>
              <UserPlus className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{newUsersToday}</div>
              <p className="text-xs text-muted-foreground">cadastros nas últimas 24h</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Novos na Semana
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{newUsersWeek}</div>
              <p className="text-xs text-muted-foreground">cadastros nos últimos 7 dias</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Crescimento
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {totalUsers > 0 ? ((newUsersWeek / totalUsers) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">crescimento semanal</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Cadastros por Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Cadastros por Dia</CardTitle>
            <CardDescription>Novos usuários nos últimos 14 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usersByDay}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis allowDecimals={false} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorUsers)"
                    strokeWidth={2}
                    name="Cadastros"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Info para lançamento */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Pronto para o Lançamento!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Após divulgar o site, acompanhe aqui em tempo real quantos novos usuários estão se cadastrando.
              Os dados são atualizados automaticamente ao carregar a página.
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span>Acesse pelo desktop para melhor visualização</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Funciona também no mobile</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
};

export default DashboardAnalytics;