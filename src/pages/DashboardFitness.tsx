import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, TrendingDown, Minus, Scale, Activity, Flame, Target } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer, CartesianGrid } from "recharts";

interface WeightEntry {
  id: string;
  weight_kg: number;
  recorded_at: string;
  notes: string | null;
}

interface ProfileHealth {
  height_cm: number | null;
  current_weight_kg: number | null;
  target_weight_kg: number | null;
  activity_level: string | null;
  calorie_goal: number | null;
  gender: string | null;
  age: number | null;
}

const DashboardFitness = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileHealth | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [dailyCalories, setDailyCalories] = useState<{ date: string; calories: number }[]>([]);
  const [weeklyCalories, setWeeklyCalories] = useState<{ week: string; calories: number; avg: number }[]>([]);
  
  // Form states
  const [newWeight, setNewWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load profile health data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("height_cm, current_weight_kg, target_weight_kg, activity_level, calorie_goal, gender, age")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        if (profileData.height_cm) setHeightCm(profileData.height_cm.toString());
        if (profileData.target_weight_kg) setTargetWeight(profileData.target_weight_kg.toString());
        if (profileData.gender) setGender(profileData.gender);
        if (profileData.age) setAge(profileData.age.toString());
      }

      // Load weight history (last 30 entries)
      const { data: weightData } = await supabase
        .from("user_weight_history")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: false })
        .limit(30);

      if (weightData) {
        setWeightHistory(weightData);
      }

      // Load daily calories for last 7 days
      const today = new Date();
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      const { data: mealsData } = await supabase
        .from("user_meals")
        .select("date_only, total_calories")
        .eq("user_id", user.id)
        .gte("date_only", last7Days[0])
        .lte("date_only", last7Days[6]);

      if (mealsData) {
        const caloriesByDay = last7Days.map(date => {
          // Normalize date comparison to handle different date formats from Supabase
          const dayMeals = mealsData.filter(m => {
            if (!m.date_only) return false;
            // Normalize date_only to YYYY-MM-DD string format
            let mealDate: string;
            if (typeof m.date_only === 'string') {
              // Could come as "2026-01-19" or "2026-01-19T00:00:00"
              mealDate = m.date_only.split('T')[0];
            } else {
              mealDate = new Date(m.date_only).toISOString().split('T')[0];
            }
            return mealDate === date;
          });
          const totalCalories = dayMeals.reduce((sum, m) => sum + (m.total_calories || 0), 0);
          return {
            date: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' }),
            calories: totalCalories
          };
        });
        setDailyCalories(caloriesByDay);
      }

      // Load weekly summary (last 4 weeks)
      const weeklyData = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (i * 7) - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const { data: weekMeals } = await supabase
          .from("user_meals")
          .select("date_only, total_calories")
          .eq("user_id", user.id)
          .gte("date_only", weekStart.toISOString().split('T')[0])
          .lte("date_only", weekEnd.toISOString().split('T')[0]);

        if (weekMeals) {
          const total = weekMeals.reduce((sum, m) => sum + (m.total_calories || 0), 0);
          const uniqueDays = new Set(weekMeals.map(m => m.date_only)).size;
          weeklyData.push({
            week: `Semana ${4 - i}`,
            calories: total,
            avg: uniqueDays > 0 ? Math.round(total / uniqueDays) : 0
          });
        }
      }
      setWeeklyCalories(weeklyData);

    } catch (error) {
      console.error("Error loading fitness data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (!profile?.height_cm || !profile?.current_weight_kg) return null;
    const heightM = profile.height_cm / 100;
    return (profile.current_weight_kg / (heightM * heightM)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "Abaixo do peso", color: "text-blue-500" };
    if (bmi < 25) return { label: "Peso normal", color: "text-green-500" };
    if (bmi < 30) return { label: "Sobrepeso", color: "text-yellow-500" };
    return { label: "Obesidade", color: "text-red-500" };
  };

  const calculateBMR = () => {
    if (!profile?.current_weight_kg || !profile?.height_cm || !profile?.age || !profile?.gender) return null;
    
    // Mifflin-St Jeor Equation
    const base = (10 * profile.current_weight_kg) + (6.25 * profile.height_cm) - (5 * profile.age);
    return profile.gender === 'male' ? Math.round(base + 5) : Math.round(base - 161);
  };

  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null;
    const latest = weightHistory[0].weight_kg;
    const previous = weightHistory[1].weight_kg;
    const diff = latest - previous;
    
    // Assuming goal is to lose weight if target < current
    const wantsToLose = profile?.target_weight_kg && profile?.current_weight_kg && 
                        profile.target_weight_kg < profile.current_weight_kg;
    
    if (Math.abs(diff) < 0.1) return { icon: Minus, color: "text-muted-foreground", message: "Peso estável" };
    if (diff < 0) {
      return wantsToLose 
        ? { icon: TrendingDown, color: "text-green-500", message: `🎉 Parabéns! Perdeu ${Math.abs(diff).toFixed(1)}kg` }
        : { icon: TrendingDown, color: "text-blue-500", message: `Perdeu ${Math.abs(diff).toFixed(1)}kg` };
    }
    return wantsToLose
      ? { icon: TrendingUp, color: "text-red-500", message: `Ganhou ${diff.toFixed(1)}kg` }
      : { icon: TrendingUp, color: "text-green-500", message: `🎉 Ganhou ${diff.toFixed(1)}kg` };
  };

  const handleSaveWeight = async () => {
    if (!newWeight) return;
    
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const weightValue = parseFloat(newWeight);

      // Insert weight history with full timestamp
      const { error: weightError } = await supabase
        .from("user_weight_history")
        .insert({
          user_id: user.id,
          weight_kg: weightValue,
          recorded_at: new Date().toISOString()
        });

      if (weightError) throw weightError;

      // Update current weight in profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ current_weight_kg: weightValue })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast({ title: "Peso registrado!", description: `${weightValue}kg salvo com sucesso.` });
      setNewWeight("");
      loadData();
    } catch (error) {
      console.error("Error saving weight:", error);
      toast({ title: "Erro", description: "Não foi possível salvar o peso.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates: Partial<ProfileHealth> = {};
      if (heightCm) updates.height_cm = parseInt(heightCm);
      if (targetWeight) updates.target_weight_kg = parseFloat(targetWeight);
      if (gender) updates.gender = gender;
      if (age) updates.age = parseInt(age);

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas." });
      loadData();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({ title: "Erro", description: "Não foi possível salvar.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const trend = getWeightTrend();

  const caloriesChartConfig: ChartConfig = {
    calories: {
      label: "Calorias",
      color: "hsl(var(--primary))",
    },
  };

  const weightChartConfig: ChartConfig = {
    weight_kg: {
      label: "Peso (kg)",
      color: "hsl(var(--primary))",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Evolução Fitness</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Acompanhe seu progresso e métricas de saúde</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              IMC
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bmi ? (
              <>
                <p className="text-xl sm:text-2xl font-bold">{bmi}</p>
                <p className={`text-xs sm:text-sm ${getBMIStatus(parseFloat(bmi)).color}`}>
                  {getBMIStatus(parseFloat(bmi)).label}
                </p>
              </>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">Configure altura e peso</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              Taxa Basal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bmr ? (
              <>
                <p className="text-xl sm:text-2xl font-bold">{bmr}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">kcal/dia</p>
              </>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">Complete seu perfil</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Scale className="h-4 w-4" />
              Peso Atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.current_weight_kg ? (
              <>
                <p className="text-xl sm:text-2xl font-bold">{profile.current_weight_kg}kg</p>
                {trend && (
                  <p className={`text-xs sm:text-sm flex items-center gap-1 ${trend.color}`}>
                    <trend.icon className="h-3 w-3" />
                    <span className="truncate">{trend.message}</span>
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">Registre seu peso</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Meta de Peso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.target_weight_kg ? (
              <>
                <p className="text-xl sm:text-2xl font-bold">{profile.target_weight_kg}kg</p>
                {profile?.current_weight_kg && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Faltam {Math.abs(profile.current_weight_kg - profile.target_weight_kg).toFixed(1)}kg
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">Defina sua meta</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Calorie Chart */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Consumo Calórico</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyCalories.some(d => d.calories > 0) ? (
              <ChartContainer config={caloriesChartConfig} className="h-[180px] sm:h-[200px]">
                <BarChart data={dailyCalories}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} fontSize={10} width={35} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[180px] sm:h-[200px] flex items-center justify-center text-muted-foreground px-4">
                <p className="text-xs sm:text-sm text-center">Envie fotos de refeições para o assistente para registrar calorias</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weight Evolution Chart */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Evolução do Peso</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Histórico de pesagens</CardDescription>
          </CardHeader>
          <CardContent>
            {weightHistory.length > 0 ? (
              <ChartContainer config={weightChartConfig} className="h-[180px] sm:h-[200px]">
                <LineChart data={[...weightHistory].reverse().slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="recorded_at" 
                    tickLine={false} 
                    axisLine={false} 
                    fontSize={10}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
                    }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    fontSize={10}
                    width={35}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="weight_kg" 
                    stroke="var(--color-weight_kg)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-weight_kg)" }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[180px] sm:h-[200px] flex items-center justify-center text-muted-foreground px-4">
                <p className="text-xs sm:text-sm text-center">Registre seu peso para ver o histórico</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Forms */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Weight Registration */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Registrar Peso</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Acompanhe sua evolução regularmente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="flex-1">
                <Label htmlFor="weight" className="text-sm">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 75.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="text-base"
                />
              </div>
              <div className="flex sm:items-end">
                <Button onClick={handleSaveWeight} disabled={saving || !newWeight} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Health Settings */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Configurações de Saúde</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Dados para cálculo de IMC e TMB</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="height" className="text-sm">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Ex: 175"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="text-base"
                />
              </div>
              <div>
                <Label htmlFor="target" className="text-sm">Meta de Peso (kg)</Label>
                <Input
                  id="target"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="text-base"
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-sm">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-base"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-sm">Sexo</Label>
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Configurações"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardFitness;