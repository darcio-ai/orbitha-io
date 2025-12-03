import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Edit, Ban, Key, Trash2, Plus, Search, Users, Bot } from "lucide-react";
import { format } from "date-fns";
import { AdminGuard } from "@/components/AdminGuard";

interface Profile {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  created_at: string;
  subscription_status: string | null;
  user_roles: Array<{ role: string }>;
}

interface Agent {
  id: string;
  name: string;
  avatar_url: string | null;
}

const DashboardUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [userAgents, setUserAgents] = useState<Record<string, Agent[]>>({});
  const [loadingAgents, setLoadingAgents] = useState<Record<string, boolean>>({});
  
  // Mass deletion states
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
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
    setSelectedUsers([]);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, firstname, lastname, phone, email, created_at, subscription_status, user_roles(role)")
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

  const fetchUserAgents = async (userId: string) => {
    if (userAgents[userId] || loadingAgents[userId]) return;
    
    setLoadingAgents(prev => ({ ...prev, [userId]: true }));
    
    const { data, error } = await supabase
      .from("agents_users")
      .select("agent_id, agents(id, name, avatar_url)")
      .eq("user_id", userId);

    if (!error && data) {
      const agents: Agent[] = data
        .map(au => au.agents as unknown as Agent | null)
        .filter((a): a is Agent => a !== null);
      setUserAgents(prev => ({ ...prev, [userId]: agents }));
    }
    
    setLoadingAgents(prev => ({ ...prev, [userId]: false }));
  };

  const getSubscriptionBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>;
      case 'inactive':
      default:
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">Inativo</Badge>;
    }
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

  // Selection handlers
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    // Filter out admin users - they cannot be deleted
    const selectableUsers = paginatedUsers.filter(
      u => !u.user_roles.some(r => r.role === 'admin')
    );
    
    const allSelected = selectableUsers.length > 0 && 
      selectableUsers.every(u => selectedUsers.includes(u.id));
    
    if (allSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(selectableUsers.map(u => u.id));
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      
      if (sessionError || !session) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userIds: selectedUsers },
      });

      if (error) {
        throw new Error(error.message || 'Erro ao excluir usuários');
      }

      const result = data as { deleted?: number; failed?: Array<{ id: string; error: string }> };
      
      if (result.failed && result.failed.length > 0) {
        toast({
          variant: "destructive",
          title: `${result.deleted || 0} usuário(s) excluído(s), ${result.failed.length} falha(s)`,
          description: result.failed.map(f => f.error).join(', '),
        });
      } else {
        toast({
          title: `${result.deleted || selectedUsers.length} usuário(s) excluído(s) com sucesso!`,
        });
      }

      setIsBulkDeleteOpen(false);
      setSelectedUsers([]);
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
        title: "Erro ao excluir usuários",
        description: errorMessage,
      });
    } finally {
      setBulkDeleting(false);
    }
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
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      
      if (sessionError || !session) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

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
      let errorMessage = error.message;
      
      if (errorMessage.includes('400:')) {
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
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      
      if (sessionError || !session) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

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
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Suspensão de usuário será implementada em breve.",
    });
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      
      if (sessionError || !session) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

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
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <div className="flex gap-2">
          {selectedUsers.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={() => setIsBulkDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir {selectedUsers.length} selecionado(s)
            </Button>
          )}
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
              <TableHead className="w-12">
                <Checkbox 
                  checked={
                    paginatedUsers.filter(u => !u.user_roles.some(r => r.role === 'admin')).length > 0 &&
                    paginatedUsers
                      .filter(u => !u.user_roles.some(r => r.role === 'admin'))
                      .every(u => selectedUsers.includes(u.id))
                  }
                  onCheckedChange={handleSelectAll}
                  disabled={paginatedUsers.every(u => u.user_roles.some(r => r.role === 'admin'))}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Assinatura</TableHead>
              <TableHead>Agentes</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                      disabled={user.user_roles.some(r => r.role === 'admin')}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.firstname} {user.lastname}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription_status)}</TableCell>
                  <TableCell>
                    {user.user_roles.some(r => r.role === 'admin') ? (
                      <Badge variant="outline" className="text-xs">Todos (Admin)</Badge>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => fetchUserAgents(user.id)}
                          >
                            <Bot className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Agentes vinculados</h4>
                            {loadingAgents[user.id] ? (
                              <p className="text-xs text-muted-foreground">Carregando...</p>
                            ) : userAgents[user.id]?.length > 0 ? (
                              <div className="space-y-1">
                                {userAgents[user.id].map(agent => (
                                  <div key={agent.id} className="flex items-center gap-2 text-sm">
                                    {agent.avatar_url ? (
                                      <img src={agent.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                                    ) : (
                                      <Bot className="w-5 h-5 text-muted-foreground" />
                                    )}
                                    <span>{agent.name}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">Nenhum agente vinculado</p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>
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
                        onClick={() => navigate(`/dashboard/users/${user.id}/agents`)}
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
                        title={user.user_roles.some(r => r.role === 'admin') 
                          ? "Administradores não podem ser excluídos" 
                          : "Excluir"}
                        disabled={user.user_roles.some(r => r.role === 'admin')}
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

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão em Massa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedUsers.length} usuário(s)? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={bulkDeleting}
            >
              {bulkDeleting ? "Excluindo..." : `Excluir ${selectedUsers.length} usuário(s)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DashboardUsersPage = () => (
  <AdminGuard>
    <DashboardUsers />
  </AdminGuard>
);

export default DashboardUsersPage;
