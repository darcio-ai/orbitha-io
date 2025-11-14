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
import { MessageSquare, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

      console.log('=== FETCH USER AGENTS ===');
      console.log('User ID:', session.user.id);

      // Use secure RPC to fetch agents accessible to the current user
      const { data, error } = await supabase.rpc('get_user_agents');

      console.log('RPC result:', { data, error });

      if (error) {
        console.error('Erro na RPC get_user_agents:', error);
        throw error;
      }

      console.log('Query result:', { data, error });

      if (error) {
        console.error('Erro na query de agentes:', error);
        throw error;
      }

      console.log('Agentes encontrados:', data);
      setAgents(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar agentes:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar agentes",
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meus Agentes</h1>
          <p className="text-muted-foreground mt-2">
            Agentes de IA disponíveis para você
          </p>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum agente disponível</h3>
          <p className="text-muted-foreground">
            Você ainda não tem acesso a nenhum agente. Entre em contato com o administrador.
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
                <TableHead>Modelo</TableHead>
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
                    <Badge variant="outline">{agent.model}</Badge>
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
                        title="Conversar com o agente"
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
