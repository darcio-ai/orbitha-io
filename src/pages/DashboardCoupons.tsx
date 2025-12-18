import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket, Plus, Pencil, Trash2, TrendingUp, Users, DollarSign, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string;
  active: boolean;
  applicable_plans: string[] | null;
  min_plan_value: number | null;
}

interface CouponUsage {
  id: string;
  user_id: string;
  coupon_id: string;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  used_at: string;
  plan_type: string;
  coupons: {
    code: string;
  };
}

interface CouponFormData {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  valid_from: string;
  valid_until: string;
  applicable_plans: string[];
  min_plan_value: number | null;
}

const DashboardCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [usageHistory, setUsageHistory] = useState<CouponUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: 0,
    max_uses: null,
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: "",
    applicable_plans: [],
    min_plan_value: null,
  });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [couponsRes, usageRes] = await Promise.all([
        supabase.from("coupons").select("*").order("created_at", { ascending: false }),
        supabase
          .from("coupon_usage")
          .select("*, coupons(code)")
          .order("used_at", { ascending: false })
          .limit(10),
      ]);

      if (couponsRes.data) setCoupons(couponsRes.data);
      if (usageRes.data) setUsageHistory(usageRes.data as CouponUsage[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      max_uses: null,
      valid_from: new Date().toISOString().split("T")[0],
      valid_until: "",
      applicable_plans: [],
      min_plan_value: null,
    });
    setEditingCoupon(null);
  };

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description || "",
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        max_uses: coupon.max_uses,
        valid_from: coupon.valid_from.split("T")[0],
        valid_until: coupon.valid_until.split("T")[0],
        applicable_plans: coupon.applicable_plans || [],
        min_plan_value: coupon.min_plan_value,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.code || !formData.valid_until || formData.discount_value <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        max_uses: formData.max_uses,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: new Date(formData.valid_until).toISOString(),
        applicable_plans: formData.applicable_plans.length > 0 ? formData.applicable_plans : null,
        min_plan_value: formData.min_plan_value,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from("coupons")
          .update(payload)
          .eq("id", editingCoupon.id);

        if (error) throw error;
        toast({ title: "Cupom atualizado com sucesso!" });
      } else {
        const { error } = await supabase.from("coupons").insert(payload);
        if (error) throw error;
        toast({ title: "Cupom criado com sucesso!" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from("coupons")
        .update({ active: !coupon.active })
        .eq("id", coupon.id);

      if (error) throw error;
      fetchData();
      toast({
        title: coupon.active ? "Cupom desativado" : "Cupom ativado",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Deseja realmente excluir o cupom ${coupon.code}?`)) return;

    try {
      const { error } = await supabase.from("coupons").delete().eq("id", coupon.id);
      if (error) throw error;
      fetchData();
      toast({ title: "Cupom excluído com sucesso!" });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Métricas
  const activeCoupons = coupons.filter((c) => c.active).length;
  const totalUses = coupons.reduce((acc, c) => acc + c.current_uses, 0);
  const totalSavings = usageHistory.reduce((acc, u) => acc + Number(u.discount_amount), 0);
  const mostPopular = coupons.reduce(
    (max, c) => (c.current_uses > (max?.current_uses || 0) ? c : max),
    null as Coupon | null
  );

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}%`;
    }
    return `R$ ${coupon.discount_value.toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ticket className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Código *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="NATAL2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Desconto especial de Natal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Desconto</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(v: "percentage" | "fixed") =>
                      setFormData({ ...formData, discount_type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor *</Label>
                  <Input
                    type="number"
                    value={formData.discount_value || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_value: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder={formData.discount_type === "percentage" ? "30" : "50.00"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Limite de Usos (deixe vazio para ilimitado)</Label>
                <Input
                  type="number"
                  value={formData.max_uses || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_uses: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Válido de</Label>
                  <Input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_from: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Válido até *</Label>
                  <Input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_until: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Valor mínimo do plano (R$)</Label>
                <Input
                  type="number"
                  value={formData.min_plan_value || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_plan_value: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="50.00"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingCoupon ? "Salvar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cupons Ativos</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Usos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Economia Gerada</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalSavings.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mais Popular</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostPopular?.code || "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Cupons */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cupons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>{formatDiscount(coupon)}</TableCell>
                  <TableCell>
                    {coupon.current_uses}
                    {coupon.max_uses ? `/${coupon.max_uses}` : "/∞"}
                  </TableCell>
                  <TableCell>
                    {formatDate(coupon.valid_from)} - {formatDate(coupon.valid_until)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.active ? "default" : "secondary"}>
                      {coupon.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Switch
                        checked={coupon.active}
                        onCheckedChange={() => handleToggleActive(coupon)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(coupon)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(coupon)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {coupons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum cupom cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Histórico de Uso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Últimos Usos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usageHistory.length > 0 ? (
            <div className="space-y-3">
              {usageHistory.map((usage) => (
                <div
                  key={usage.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{usage.coupons?.code}</span>
                    <span className="text-muted-foreground ml-2">
                      usado em {usage.plan_type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="line-through text-muted-foreground">
                        R$ {Number(usage.original_amount).toFixed(2)}
                      </span>
                      <span className="ml-2 text-green-600 font-medium">
                        R$ {Number(usage.final_amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(usage.used_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum uso registrado ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCoupons;
