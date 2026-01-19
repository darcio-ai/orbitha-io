-- Adicionar campos de saúde ao profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS height_cm INTEGER,
ADD COLUMN IF NOT EXISTS current_weight_kg NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS target_weight_kg NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
ADD COLUMN IF NOT EXISTS calorie_goal INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));

-- Criar tabela de histórico de peso
CREATE TABLE IF NOT EXISTS public.user_weight_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para consultas por usuário e data
CREATE INDEX IF NOT EXISTS idx_user_weight_history_user_date ON public.user_weight_history(user_id, recorded_at DESC);

-- Habilitar RLS
ALTER TABLE public.user_weight_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para weight_history
CREATE POLICY "Users can view own weight history" 
ON public.user_weight_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight history" 
ON public.user_weight_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight history" 
ON public.user_weight_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight history" 
ON public.user_weight_history 
FOR DELETE 
USING (auth.uid() = user_id);