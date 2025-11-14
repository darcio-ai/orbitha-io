import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Pause, Trash2, Play, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Agent {
  id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  avatar_url: string | null;
  temperature: number;
  model: string;
  url: string;
  status: "active" | "suspended" | "deleted";
  owner_id: string;
  created_at: string;
  updated_at: string;
}

const OPENAI_MODELS = [
  { value: "gpt-5-2025-08-07", label: "GPT-5 (Flagship)" },
  { value: "gpt-5-mini-2025-08-07", label: "GPT-5 Mini (Rápido)" },
  { value: "gpt-5-nano-2025-08-07", label: "GPT-5 Nano (Mais Rápido)" },
  { value: "gpt-4.1-2025-04-14", label: "GPT-4.1" },
  { value: "o3-2025-04-16", label: "O3 (Reasoning)" },
  { value: "o4-mini-2025-04-16", label: "O4 Mini (Fast Reasoning)" },
];

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const DashboardAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompt: "",
    avatar_url: "",
    temperature: "0.7",
    model: "gpt-5-mini-2025-08-07",
    url: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .neq("status", "deleted")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar agentes",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      url: generateSlug(name),
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      prompt: "",
      avatar_url: "",
      temperature: "0.7",
      model: "gpt-5-mini-2025-08-07",
      url: "",
    });
    setAvatarFile(null);
    setSelectedAgent(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      description: agent.description || "",
      prompt: agent.prompt || "",
      avatar_url: agent.avatar_url || "",
      temperature: agent.temperature.toString(),
      model: agent.model,
      url: agent.url,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const agentData = {
        name: formData.name,
        description: formData.description || null,
        prompt: formData.prompt || null,
        avatar_url: formData.avatar_url || null,
        temperature: parseFloat(formData.temperature),
        model: formData.model,
        url: formData.url,
        owner_id: user.id,
      };

      if (selectedAgent) {
        const { error } = await supabase
          .from("agents")
          .update(agentData)
          .eq("id", selectedAgent.id);

        if (error) throw error;

        toast({
          title: "Agente atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase.from("agents").insert([agentData]);

        if (error) throw error;

        toast({
          title: "Agente criado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchAgents();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: selectedAgent ? "Erro ao atualizar agente" : "Erro ao criar agente",
        description: error.message,
      });
    }
  };

  const handleSuspend = async (agent: Agent) => {
    try {
      const newStatus = agent.status === "active" ? "suspended" : "active";
      const { error } = await supabase
        .from("agents")
        .update({ status: newStatus })
        .eq("id", agent.id);

      if (error) throw error;

      toast({
        title: newStatus === "suspended" ? "Agente suspenso" : "Agente reativado",
      });

      fetchAgents();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao alterar status",
        description: error.message,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAgent) return;

    try {
      const { error } = await supabase
        .from("agents")
        .update({ status: "deleted" })
        .eq("id", selectedAgent.id);

      if (error) throw error;

      toast({
        title: "Agente deletado com sucesso!",
      });

      setIsDeleteDialogOpen(false);
      setSelectedAgent(null);
      fetchAgents();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar agente",
        description: error.message,
      });
    }
  };

  const openDeleteDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando agentes...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agentes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus agentes de IA
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Agente
        </Button>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhum agente encontrado
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Agente
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Temperatura</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={agent.avatar_url || undefined} />
                        <AvatarFallback>
                          {agent.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        {agent.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {agent.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{agent.model}</TableCell>
                  <TableCell className="text-sm font-mono">
                    /{agent.url}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agent.status === "active"
                          ? "default"
                          : agent.status === "suspended"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {agent.status === "active"
                        ? "Ativo"
                        : agent.status === "suspended"
                        ? "Suspenso"
                        : "Deletado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{agent.temperature}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/chat/${agent.url}`, '_blank')}
                        title="Abrir chat"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(agent)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSuspend(agent)}
                      >
                        {agent.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(agent)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAgent ? "Editar Agente" : "Criar Novo Agente"}
            </DialogTitle>
            <DialogDescription>
              {selectedAgent
                ? "Atualize as informações do agente"
                : "Preencha os dados para criar um novo agente"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Ex: Assistente de Vendas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL (slug) *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                required
                placeholder="Ex: assistente-vendas"
              />
              <p className="text-xs text-muted-foreground">
                URL gerada automaticamente a partir do nome
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Breve descrição do agente"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt do Sistema</Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, prompt: e.target.value }))
                }
                placeholder="Instruções e personalidade do agente"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo OpenAI *</Label>
              <Select
                value={formData.model}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, model: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPENAI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperatura *</Label>
              <Input
                id="temperature"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    temperature: e.target.value,
                  }))
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Valor entre 0 (mais determinístico) e 1 (mais criativo)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              {formData.avatar_url && (
                <div className="mt-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={formData.avatar_url} />
                    <AvatarFallback>
                      {formData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedAgent ? "Atualizar" : "Criar"} Agente
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o agente{" "}
              <strong>{selectedAgent?.name}</strong>? Esta ação irá marcar o
              agente como deletado (soft delete).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardAgents;
