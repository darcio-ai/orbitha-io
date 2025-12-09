import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Phone, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  conversa_id: string | null;
  created_at: string;
  agendamentos: {
    id: string;
    status: string;
  }[];
}

export default function ClientsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select(`
          *,
          agendamentos(id, status)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Cliente[];
    },
  });

  const filteredClientes = clientes?.filter((c) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      c.nome.toLowerCase().includes(searchLower) ||
      c.telefone.includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-lg">Clientes Cadastrados</CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando clientes...
          </div>
        ) : filteredClientes?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum cliente encontrado
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClientes?.map((cliente) => {
              const totalAgendamentos = cliente.agendamentos?.length || 0;
              const agendamentosAtivos = cliente.agendamentos?.filter(
                (a) => a.status === "agendado" || a.status === "confirmado"
              ).length || 0;

              return (
                <div
                  key={cliente.id}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{cliente.nome}</h3>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span className="truncate">{cliente.telefone}</span>
                        </div>
                        {cliente.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{cliente.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Cliente desde {format(new Date(cliente.created_at), "MMM yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="secondary">
                          {totalAgendamentos} agendamento{totalAgendamentos !== 1 ? "s" : ""}
                        </Badge>
                        {agendamentosAtivos > 0 && (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                            {agendamentosAtivos} ativo{agendamentosAtivos !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
