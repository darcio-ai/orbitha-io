import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminGuard } from "@/components/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Users, Gift, Star, MessageSquare, Search, RefreshCw, Calendar, Sparkles } from "lucide-react";
import { format, isPast, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BetaUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  is_beta_user: boolean;
  beta_source: string | null;
  beta_assistant_choice: string | null;
  beta_expires_at: string | null;
  created_at: string;
  subscription_status: string | null;
}

interface BetaFeedback {
  id: string;
  user_id: string;
  rating: number;
  feedback_text: string | null;
  allows_testimonial: boolean;
  allows_screenshot: boolean;
  assistant_name: string | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

interface CouponStats {
  code: string;
  current_uses: number;
  max_uses: number | null;
}

const assistantOptions = [
  { value: "all", label: "Todos" },
  { value: "business", label: "Business" },
  { value: "financeiro", label: "Financeiro" },
  { value: "vendas", label: "Vendas" },
  { value: "marketing", label: "Marketing" },
  { value: "suporte", label: "Suporte" },
  { value: "viagens", label: "Viagens" },
  { value: "fitness", label: "Fitness" },
  { value: "pacote_completo", label: "Pacote Completo" },
];

const DashboardBetaUsers = () => {
  const [betaUsers, setBetaUsers] = useState<BetaUser[]>([]);
  const [feedbacks, setFeedbacks] = useState<BetaFeedback[]>([]);
  const [couponStats, setCouponStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [assistantFilter, setAssistantFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch beta users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, email, firstname, lastname, is_beta_user, beta_source, beta_assistant_choice, beta_expires_at, created_at, subscription_status")
        .eq("is_beta_user", true)
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;
      setBetaUsers(usersData || []);

      // Fetch feedbacks with user info
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("beta_feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (feedbackError) throw feedbackError;

      // Enrich feedback with user info
      if (feedbackData && feedbackData.length > 0) {
        const userIds = [...new Set(feedbackData.map(f => f.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, email, firstname, lastname")
          .in("id", userIds);

        const enrichedFeedbacks = feedbackData.map(f => {
          const profile = profilesData?.find(p => p.id === f.user_id);
          return {
            ...f,
            user_email: profile?.email,
            user_name: profile ? `${profile.firstname} ${profile.lastname}`.trim() : "Desconhecido",
          };
        });
        setFeedbacks(enrichedFeedbacks);
      } else {
        setFeedbacks([]);
      }

      // Fetch coupon stats
      const { data: couponData, error: couponError } = await supabase
        .from("coupons")
        .select("code, current_uses, max_uses")
        .eq("code", "BETANATAL")
        .single();

      if (!couponError && couponData) {
        setCouponStats(couponData);
      }

    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = betaUsers.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAssistant = 
      assistantFilter === "all" || 
      user.beta_assistant_choice?.toLowerCase() === assistantFilter.toLowerCase();

    return matchesSearch && matchesAssistant;
  });

  const getStatusBadge = (user: BetaUser) => {
    if (user.subscription_status === "active") {
      return <Badge className="bg-green-500">Convertido</Badge>;
    }
    if (user.beta_expires_at && isPast(new Date(user.beta_expires_at))) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    return <Badge className="bg-blue-500">Beta Ativo</Badge>;
  };

  const getDaysRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const days = differenceInDays(new Date(expiresAt), new Date());
    return days > 0 ? days : 0;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
          />
        ))}
      </div>
    );
  };

  const usedSlots = couponStats?.current_uses || 0;
  const totalSlots = couponStats?.max_uses || 50;
  const progressPercent = (usedSlots / totalSlots) * 100;

  // Stats calculations
  const activeUsers = betaUsers.filter(u => 
    u.subscription_status !== "active" && 
    (!u.beta_expires_at || !isPast(new Date(u.beta_expires_at)))
  ).length;
  const convertedUsers = betaUsers.filter(u => u.subscription_status === "active").length;
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : "N/A";
  const testimonialsCount = feedbacks.filter(f => f.allows_testimonial).length;

  return (
    <AdminGuard>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Beta Natal 2024
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhamento da campanha de beta testers
            </p>
          </div>
          <Button onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vagas Usadas</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usedSlots}/{totalSlots}</div>
              <Progress value={progressPercent} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {totalSlots - usedSlots} vagas restantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Beta Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {convertedUsers} já converteram
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {feedbacks.length} feedbacks recebidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Depoimentos</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testimonialsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                autorizaram uso como case
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Beta Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Beta Testers</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={assistantFilter} onValueChange={setAssistantFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por assistente" />
                  </SelectTrigger>
                  <SelectContent>
                    {assistantOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {betaUsers.length === 0 
                  ? "Nenhum beta tester cadastrado ainda."
                  : "Nenhum resultado encontrado."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Assistente</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Dias Restantes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {`${user.firstname} ${user.lastname}`.trim() || "Sem nome"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.beta_assistant_choice || "Não informado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {user.beta_expires_at ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {getDaysRemaining(user.beta_expires_at)} dias
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Feedbacks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedbacks Recebidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum feedback recebido ainda.
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map(feedback => (
                  <div 
                    key={feedback.id} 
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{feedback.user_name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({feedback.user_email})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {renderStars(feedback.rating)}
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(feedback.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    {feedback.assistant_name && (
                      <Badge variant="outline" className="capitalize">
                        {feedback.assistant_name}
                      </Badge>
                    )}
                    {feedback.feedback_text && (
                      <p className="text-sm text-muted-foreground mt-2">
                        "{feedback.feedback_text}"
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {feedback.allows_testimonial && (
                        <Badge className="bg-green-500/20 text-green-700">
                          ✓ Autoriza depoimento
                        </Badge>
                      )}
                      {feedback.allows_screenshot && (
                        <Badge className="bg-blue-500/20 text-blue-700">
                          ✓ Autoriza prints
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
};

export default DashboardBetaUsers;