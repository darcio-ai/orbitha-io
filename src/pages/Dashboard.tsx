import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, DollarSign, ShoppingCart, TrendingUp, BarChart3, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminGuard } from "@/components/AdminGuard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Sale {
  id: string;
  product_name: string;
  product_type: string;
  acquisition_channel: string;
  amount: number;
  status: string;
  created_at: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const channelLabels: Record<string, string> = {
  organic: "Orgânico",
  paid_ads: "Anúncios Pagos",
  referral: "Indicação",
  direct: "Direto",
  social_media: "Redes Sociais",
  email: "Email",
  other: "Outros",
};

const typeLabels: Record<string, string> = {
  subscription: "Assinatura",
  one_time: "Pagamento Único",
  service: "Serviço",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [productFilter, setProductFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sales, startDate, endDate, productFilter, channelFilter, typeFilter]);

  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSales(data);
      const uniqueProducts = [...new Set(data.map(s => s.product_name))];
      setProducts(uniqueProducts);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= startDate && saleDate <= endDate;
    });

    if (productFilter !== "all") {
      filtered = filtered.filter(s => s.product_name === productFilter);
    }
    if (channelFilter !== "all") {
      filtered = filtered.filter(s => s.acquisition_channel === channelFilter);
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter(s => s.product_type === typeFilter);
    }

    setFilteredSales(filtered);
  };

  // Metrics
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, s) => sum + Number(s.amount), 0);
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Chart data - Revenue over time
  const revenueByDate = filteredSales.reduce((acc, sale) => {
    const date = format(new Date(sale.created_at), "dd/MM");
    acc[date] = (acc[date] || 0) + Number(sale.amount);
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(revenueByDate)
    .map(([date, value]) => ({ date, value }))
    .slice(-15);

  // Chart data - By channel
  const byChannel = filteredSales.reduce((acc, sale) => {
    const channel = channelLabels[sale.acquisition_channel] || sale.acquisition_channel;
    acc[channel] = (acc[channel] || 0) + Number(sale.amount);
    return acc;
  }, {} as Record<string, number>);

  const channelChartData = Object.entries(byChannel).map(([name, value]) => ({ name, value }));

  // Chart data - By type
  const byType = filteredSales.reduce((acc, sale) => {
    const type = typeLabels[sale.product_type] || sale.product_type;
    acc[type] = (acc[type] || 0) + Number(sale.amount);
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Vendas</h1>
          <p className="text-muted-foreground">Visão geral das vendas e métricas</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date Range - Start */}
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Range - End */}
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Product Filter */}
            <div className="space-y-2">
              <Label>Produto</Label>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product} value={product}>{product}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Channel Filter */}
            <div className="space-y-2">
              <Label>Canal</Label>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(channelLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Vendas
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground mt-1">
              vendas no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              faturamento no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(averageTicket)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              por venda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Receita ao Longo do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis 
                      tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                      className="text-xs"
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Receita"]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary)/0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível para o período selecionado
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* By Channel */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {channelChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" width={100} className="text-xs" />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Receita"]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* By Type */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {typeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {typeChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Receita"]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardPage = () => (
  <AdminGuard>
    <Dashboard />
  </AdminGuard>
);

export default DashboardPage;
