import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Phone, User, Search, RefreshCw, Check, X, CalendarDays, Users } from "lucide-react";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdminGuard } from "@/components/AdminGuard";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import ClientsList from "@/components/appointments/ClientsList";

type AppointmentStatus = "agendado" | "confirmado" | "cancelado" | "reagendado" | "concluido";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  conversa_id: string | null;
  created_at: string;
}

interface Agendamento {
  id: string;
  cliente_id: string;
  google_event_id: string | null;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string;
  data_txt: string;
  horario_txt: string;
  status: AppointmentStatus;
  lembrete_1dia: boolean;
  lembrete_2hs: boolean;
  created_at: string;
  cliente: Cliente;
}

const statusColors: Record<AppointmentStatus, string> = {
  agendado: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  confirmado: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelado: "bg-red-500/10 text-red-500 border-red-500/20",
  reagendado: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  concluido: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const statusLabels: Record<AppointmentStatus, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
  reagendado: "Reagendado",
  concluido: "Concluído",
};

export default function DashboardAppointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("week");
  const queryClient = useQueryClient();

  // Calculate date range based on filter
  const getDateRange = () => {
    const today = new Date();
    switch (dateFilter) {
      case "today":
        return { start: today, end: today };
      case "week":
        return { start: startOfWeek(today, { locale: ptBR }), end: endOfWeek(today, { locale: ptBR }) };
      case "month":
        return { start: startOfMonth(today), end: endOfMonth(today) };
      default:
        return { start: startOfWeek(today, { locale: ptBR }), end: endOfWeek(today, { locale: ptBR }) };
    }
  };

  const dateRange = getDateRange();

  // Fetch appointments
  const { data: agendamentos, isLoading, refetch } = useQuery({
    queryKey: ["agendamentos", statusFilter, dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("agendamentos")
        .select(`
          *,
          cliente:clientes(*)
        `)
        .gte("data_inicio", dateRange.start.toISOString())
        .lte("data_inicio", dateRange.end.toISOString())
        .order("data_inicio", { ascending: true });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Agendamento[];
    },
  });

  // Update appointment status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      const { error } = await supabase
        .from("agendamentos")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar status: " + error.message);
    },
  });

  // Filter appointments by search term
  const filteredAgendamentos = agendamentos?.filter((a) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      a.titulo.toLowerCase().includes(searchLower) ||
      a.cliente?.nome?.toLowerCase().includes(searchLower) ||
      a.cliente?.telefone?.includes(searchTerm)
    );
  });

  // Stats
  const stats = {
    total: agendamentos?.length || 0,
    agendado: agendamentos?.filter((a) => a.status === "agendado").length || 0,
    confirmado: agendamentos?.filter((a) => a.status === "confirmado").length || 0,
    cancelado: agendamentos?.filter((a) => a.status === "cancelado").length || 0,
  };

  return (
    <AdminGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os agendamentos da Dora
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Agendados</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.agendado}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmados</p>
                  <p className="text-2xl font-bold text-green-500">{stats.confirmado}</p>
                </div>
                <Check className="h-8 w-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelados</p>
                  <p className="text-2xl font-bold text-red-500">{stats.cancelado}</p>
                </div>
                <X className="h-8 w-8 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">
              <CalendarDays className="h-4 w-4 mr-2" />
              Lista
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, telefone ou título..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="reagendado">Reagendado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {filteredAgendamentos?.length || 0} agendamentos encontrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando agendamentos...
                  </div>
                ) : filteredAgendamentos?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum agendamento encontrado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAgendamentos?.map((agendamento) => (
                      <div
                        key={agendamento.id}
                        className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{agendamento.titulo}</h3>
                            <Badge className={statusColors[agendamento.status]}>
                              {statusLabels[agendamento.status]}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {agendamento.data_txt}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {agendamento.horario_txt}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {agendamento.cliente?.nome || "Cliente"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {agendamento.cliente?.telefone}
                            </span>
                          </div>
                          {agendamento.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {agendamento.descricao}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {agendamento.status === "agendado" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-500 border-green-500/20 hover:bg-green-500/10"
                                onClick={() => updateStatus.mutate({ id: agendamento.id, status: "confirmado" })}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirmar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                                onClick={() => updateStatus.mutate({ id: agendamento.id, status: "cancelado" })}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancelar
                              </Button>
                            </>
                          )}
                          {agendamento.status === "confirmado" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus.mutate({ id: agendamento.id, status: "concluido" })}
                            >
                              Marcar como Concluído
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <AppointmentCalendar agendamentos={agendamentos || []} />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsList />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}
