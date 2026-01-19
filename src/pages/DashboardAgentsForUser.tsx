import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface Agent {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  model: string;
  url: string;
  status: "active" | "suspended" | "deleted";
}

const DashboardAgentsForUser = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchUserAgents();
  }, []);

  const fetchUserAgents = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Você precisa estar autenticado.",
        });
        return;
      }

      const { data, error } = await supabase.rpc('get_user_agents');

      if (error) {
        console.error('Erro na RPC get_user_agents:', error);
        throw error;
      }

      setAgents(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar assistentes:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar assistentes",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (url: string) => {
    navigate(`/chat/${url}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mobile Layout - Cards otimizados
  if (isMobile) {
    return (
      <div className="p-4 space-y-5">
        <div className="px-1">
          <h1 className="text-xl font-bold">Meus Assistentes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Assistentes de IA disponíveis
          </p>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum assistente disponível</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Você ainda não tem acesso a nenhum assistente. Entre em contato com o administrador.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleChat(agent.url)}
                className="w-full p-4 border rounded-xl bg-card flex items-center justify-between gap-3 active:bg-muted/50 transition-colors touch-target"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={agent.avatar_url || undefined} />
                    <AvatarFallback className="text-base">
                      {agent.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left min-w-0">
                    <span className="font-semibold text-base block truncate">{agent.name}</span>
                    {agent.description && (
                      <span className="text-sm text-muted-foreground block truncate">
                        {agent.description}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Conversar</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout - Table
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meus Assistentes</h1>
          <p className="text-muted-foreground mt-2">
            Assistentes de IA disponíveis para você
          </p>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum assistente disponível</h3>
          <p className="text-muted-foreground">
            Você ainda não tem acesso a nenhum assistente. Entre em contato com o administrador.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={agent.avatar_url || undefined} />
                      <AvatarFallback>
                        {agent.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {agent.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agent.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {agent.status === "active" ? "Ativo" : "Suspenso"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChat(agent.url)}
                        title="Conversar com o assistente"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DashboardAgentsForUser;