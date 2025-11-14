import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Ban, Key, Trash2, Plus, Search, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface Profile {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  created_at: string;
  user_roles: Array<{ role: string }>;
}

interface Agent {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  status: string;
}

const DashboardUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    role: "user",
  });
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { toast } = useToast();
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*, user_roles(role)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: error.message,
      });
    } else {
      setUsers(data || []);
      setFilteredUsers(data || []);
    }
    setLoading(false);
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (!cleaned.startsWith("55")) {
      return { valid: false, message: "Telefone deve começar com 55" };
    }
    if (cleaned.length !== 12 && cleaned.length !== 13) {
      return { valid: false, message: "Telefone deve ter 12 ou 13 dígitos" };
    }
    return { valid: true, cleaned };
  };

  const handleCreateUser = async () => {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      toast({
        variant: "destructive",
        title: "Telefone inválido",
        description: phoneValidation.message,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email: formData.email,
          password: formData.password,
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: phoneValidation.cleaned,
          role: formData.role,
        },
      });

      if (error) {
        // Extract error message from edge function response
        const errorMessage = error.message || 'Erro desconhecido ao criar usuário';
        throw new Error(errorMessage);
      }

      toast({
        title: "Usuário criado com sucesso!",
      });

      setIsCreateOpen(false);
      setFormData({ firstname: "", lastname: "", phone: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (error: any) {
      // Handle edge function errors
      let errorMessage = error.message;
      
      if (errorMessage.includes('400:')) {
        // Extract the actual error message from edge function format
        const match = errorMessage.match(/{"error":"([^"]+)"}/);
        if (match) {
          errorMessage = match[1];
        }
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: errorMessage,
      });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      toast({
        variant: "destructive",
        title: "Telefone inválido",
        description: phoneValidation.message,
      });
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: phoneValidation.cleaned,
          email: formData.email,
        })
        .eq("id", selectedUser.id);

      if (profileError) throw profileError;

      await supabase.from("user_roles").delete().eq("user_id", selectedUser.id);
      const { error: roleError } = await supabase.from("user_roles").insert([{
        user_id: selectedUser.id,
        role: formData.role as "admin" | "user",
      }]);

      if (roleError) throw roleError;

      toast({
        title: "Usuário atualizado com sucesso!",
      });

      setIsEditOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('duplicate key') && errorMessage.includes('email')) {
        errorMessage = 'Este email já está sendo usado por outro usuário';
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: errorMessage,
      });
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser) return;

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "As senhas não coincidem",
        description: "Digite a mesma senha nos dois campos",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-update-password', {
        body: {
          userId: selectedUser.id,
          newPassword: newPassword,
        },
      });

      if (error) {
        const errorMessage = error.message || 'Erro desconhecido ao alterar senha';
        throw new Error(errorMessage);
      }

      toast({
        title: "Senha alterada com sucesso!",
      });

      setIsPasswordOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      setSelectedUser(null);
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('400:')) {
        const match = errorMessage.match(/{"error":"([^"]+)"}/);
        if (match) {
          errorMessage = match[1];
        }
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao alterar senha",
        description: errorMessage,
      });
    }
  };

  const handleToggleSuspend = async (user: Profile) => {
    // Implementação futura: adicionar coluna suspended no banco
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Suspensão de usuário será implementada em breve.",
    });
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: {
          userId: selectedUser.id,
        },
      });

      if (error) {
        const errorMessage = error.message || 'Erro desconhecido ao excluir usuário';
        throw new Error(errorMessage);
      }

      toast({
        title: "Usuário excluído com sucesso!",
        description: "O usuário foi removido do sistema completamente.",
      });

      setIsDeleteOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (errorMessage.includes('400:')) {
        const match = errorMessage.match(/{"error":"([^"]+)"}/);
        if (match) {
          errorMessage = match[1];
        }
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: errorMessage,
      });
    }
  };

  const openAgentsDialog = async (user: Profile) => {
    setSelectedUser(user);
    
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
      return;
    }

    setAvailableAgents(agents || []);

    // Carregar os agentes que o usuário já tem acesso
    const { data: userAgents, error: userAgentsError } = await supabase
      .from("agents_users")
      .select("agent_id")
      .eq("user_id", user.id);

    if (userAgentsError) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar agentes do usuário",
        description: userAgentsError.message,
      });
      return;
    }

    setSelectedAgents(userAgents?.map(ua => ua.agent_id) || []);
    setIsAgentsOpen(true);
  };

  const handleSaveAgents = async () => {
    if (!selectedUser) return;

    try {
      // Remover todas as associações antigas do usuário
      const { error: deleteError } = await supabase
        .from("agents_users")
        .delete()
        .eq("user_id", selectedUser.id);

      if (deleteError) throw deleteError;

      // Inserir as novas associações
      if (selectedAgents.length > 0) {
        const { error: insertError } = await supabase
          .from("agents_users")
          .insert(
            selectedAgents.map(agentId => ({
              user_id: selectedUser.id,
              agent_id: agentId,
            }))
          );

        if (insertError) throw insertError;
      }

      toast({
        title: "Agentes atualizados",
        description: "Os agentes foram atribuídos com sucesso.",
      });

      setIsAgentsOpen(false);
      setSelectedUser(null);
      setSelectedAgents([]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atribuir agentes",
        description: error.message,
      });
    }
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const openEditDialog = (user: Profile) => {
    setSelectedUser(user);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      password: "",
      role: user.user_roles[0]?.role || "user",
    });
    setIsEditOpen(true);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Nome</Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Sobrenome</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (ex: 5548991893313)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                  placeholder="5548991893313"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Perfil</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstname} {user.lastname}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{format(new Date(user.created_at), "dd/MM/yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleSuspend(user)}
                        title="Suspender"
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsPasswordOpen(true);
                        }}
                        title="Alterar Senha"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openAgentsDialog(user)}
                        title={user.user_roles.some(r => r.role === 'admin') ? "Administradores têm acesso a todos os agentes" : "Gerenciar Agentes"}
                        disabled={user.user_roles.some(r => r.role === 'admin')}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteOpen(true);
                        }}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstname">Nome</Label>
              <Input
                id="edit-firstname"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastname">Sobrenome</Label>
              <Input
                id="edit-lastname"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Perfil</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Digite a nova senha para {selectedUser?.firstname} {selectedUser?.lastname}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword}>Alterar Senha</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário {selectedUser?.firstname} {selectedUser?.lastname}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manage Agents Dialog */}
      <Dialog open={isAgentsOpen} onOpenChange={setIsAgentsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Agentes</DialogTitle>
            <DialogDescription>
              Selecione os agentes que {selectedUser?.firstname} {selectedUser?.lastname} terá acesso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {availableAgents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum agente disponível
              </p>
            ) : (
              <div className="space-y-3">
                {availableAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={agent.id}
                      checked={selectedAgents.includes(agent.id)}
                      onCheckedChange={() => toggleAgent(agent.id)}
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={agent.id}
                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {agent.name}
                      </label>
                      {agent.description && (
                        <p className="text-sm text-muted-foreground">
                          {agent.description}
                        </p>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        agent.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {agent.status === 'active' ? 'Ativo' : 'Suspenso'}
                      </span>
                    </div>
                    {agent.avatar_url && (
                      <img
                        src={agent.avatar_url}
                        alt={agent.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAgentsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAgents}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardUsers;
