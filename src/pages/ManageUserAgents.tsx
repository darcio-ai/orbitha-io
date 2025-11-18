import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminGuard } from "@/components/AdminGuard";

interface Agent {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  status: string;
}

interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

const ManageUserAgents = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    const filtered = availableAgents.filter((agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredAgents(filtered);
  }, [searchTerm, availableAgents]);

  const fetchData = async () => {
    setLoading(true);

    // Carregar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, firstname, lastname, email")
      .eq("id", userId)
      .single();

    if (userError) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuário",
        description: userError.message,
      });
      navigate("/dashboard/users");
      return;
    }

    setUser(userData);

    // Carregar todos os agentes disponíveis
    const { data: agents, error: agentsError } = await supabase
      .from("agents")
      .select("id, name, description, avatar_url, status")
      .neq("status", "deleted")
      .order("name");

    if (agentsError) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar agentes",
        description: agentsError.message,
      });
    } else {
      setAvailableAgents(agents || []);
      setFilteredAgents(agents || []);
    }

    // Carregar os agentes que o usuário já tem acesso
    const { data: userAgents, error: userAgentsError } = await supabase
      .from("agents_users")
      .select("agent_id")
      .eq("user_id", userId);

    if (userAgentsError) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar agentes do usuário",
        description: userAgentsError.message,
      });
    } else {
      setSelectedAgents(userAgents?.map((ua) => ua.agent_id) || []);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);

    try {
      console.log('=== INÍCIO DO SALVAMENTO ===');
      console.log('User ID:', userId);
      console.log('Selected Agents:', selectedAgents);
      
      // Remover todas as associações antigas do usuário
      const { error: deleteError } = await supabase
        .from("agents_users")
        .delete()
        .eq("user_id", userId);

      if (deleteError) {
        console.error('Erro ao deletar:', deleteError);
        throw deleteError;
      }

      console.log('Associações antigas removidas');

      // Inserir as novas associações
      if (selectedAgents.length > 0) {
        console.log('Inserindo novas associações...');
        const inserts = selectedAgents.map((agentId) => ({
          user_id: userId,
          agent_id: agentId,
        }));
        console.log('Dados a serem inseridos:', inserts);
        
        const { data: insertData, error: insertError } = await supabase
          .from("agents_users")
          .insert(inserts)
          .select();

        if (insertError) {
          console.error('Erro ao inserir:', insertError);
          throw insertError;
        }
        
        console.log('Dados inseridos com sucesso:', insertData);
      } else {
        console.log('Nenhum agente selecionado para inserir');
      }

      toast({
        title: "Agentes atualizados",
        description: `${selectedAgents.length} agente(s) atribuído(s) com sucesso.`,
      });

      console.log('=== FIM DO SALVAMENTO ===');
      
      navigate("/dashboard/users");
    } catch (error: any) {
      console.error('=== ERRO NO SALVAMENTO ===', error);
      toast({
        variant: "destructive",
        title: "Erro ao atribuir agentes",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) => {
      const newSelection = prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId];
      
      console.log('Toggle Agent:', agentId);
      console.log('Previous selection:', prev);
      console.log('New selection:', newSelection);
      
      return newSelection;
    });
  };

  const toggleAll = () => {
    if (selectedAgents.length === filteredAgents.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(filteredAgents.map((a) => a.id));
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/users")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Usuários
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Gerenciar Agentes
            </h1>
            <p className="text-muted-foreground mt-2">
              Atribuindo agentes para: <span className="font-medium text-foreground">{user?.firstname} {user?.lastname}</span> ({user?.email})
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard/users")}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar agentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={toggleAll} size="sm">
            {selectedAgents.length === filteredAgents.length ? "Desmarcar Todos" : "Selecionar Todos"}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          <strong>{selectedAgents.length}</strong> de {availableAgents.length} agentes selecionados
          {selectedAgents.length > 0 && (
            <span className="ml-2 text-primary">
              • Clique em "Salvar Alterações" para confirmar
            </span>
          )}
        </div>

        {filteredAgents.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {searchTerm ? "Nenhum agente encontrado" : "Nenhum agente disponível"}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={agent.id}
                  checked={selectedAgents.includes(agent.id)}
                  onCheckedChange={() => toggleAgent(agent.id)}
                  className="mt-1"
                />
                
                {agent.avatar_url && (
                  <img
                    src={agent.avatar_url}
                    alt={agent.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                
                <div className="flex-1 space-y-1">
                  <label
                    htmlFor={agent.id}
                    className="text-base font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {agent.name}
                  </label>
                  {agent.description && (
                    <p className="text-sm text-muted-foreground">
                      {agent.description}
                    </p>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      agent.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {agent.status === "active" ? "Ativo" : "Suspenso"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ManageUserAgentsPage = () => (
  <AdminGuard>
    <ManageUserAgents />
  </AdminGuard>
);

export default ManageUserAgentsPage;
