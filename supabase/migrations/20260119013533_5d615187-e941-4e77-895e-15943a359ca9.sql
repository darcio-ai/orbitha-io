-- Create table for user meals (Fitness Assistant)
CREATE TABLE public.user_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meal_name TEXT NOT NULL CHECK (meal_name IN (
    'café da manhã', 'lanche da manhã', 'almoço', 
    'lanche da tarde', 'jantar', 'ceia'
  )),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_calories INTEGER NOT NULL CHECK (total_calories >= 0 AND total_calories <= 10000),
  
  -- Campos calculados via trigger
  week_number INTEGER,
  month TEXT,
  date_only DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Função para calcular campos derivados
CREATE OR REPLACE FUNCTION public.calculate_meal_derived_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.week_number := EXTRACT(WEEK FROM NEW.datetime)::INTEGER;
  NEW.month := TO_CHAR(NEW.datetime, 'YYYY-MM');
  NEW.date_only := NEW.datetime::DATE;
  RETURN NEW;
END;
$$;

-- Trigger para calcular campos antes de INSERT/UPDATE
CREATE TRIGGER trigger_calculate_meal_fields
  BEFORE INSERT OR UPDATE ON public.user_meals
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_meal_derived_fields();

-- Índices para performance
CREATE INDEX idx_user_meals_user_datetime 
  ON public.user_meals(user_id, datetime DESC);

CREATE INDEX idx_user_meals_user_week 
  ON public.user_meals(user_id, week_number, datetime);

CREATE INDEX idx_user_meals_user_month 
  ON public.user_meals(user_id, month, datetime);

CREATE INDEX idx_user_meals_user_meal 
  ON public.user_meals(user_id, meal_name, datetime);

-- Ativar RLS
ALTER TABLE public.user_meals ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Block anonymous access to user_meals"
  ON public.user_meals FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own meals"
  ON public.user_meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
  ON public.user_meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
  ON public.user_meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
  ON public.user_meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all meals"
  ON public.user_meals FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Função: Resumo Diário
CREATE OR REPLACE FUNCTION public.get_daily_summary(
  _user_id UUID,
  _date DATE
)
RETURNS TABLE (
  total_calories INTEGER,
  meal_count INTEGER,
  meals JSONB
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(SUM(total_calories), 0)::INTEGER,
    COUNT(*)::INTEGER,
    COALESCE(JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'meal_name', meal_name,
        'calories', total_calories,
        'items', items,
        'datetime', datetime
      ) ORDER BY datetime
    ), '[]'::jsonb)
  FROM public.user_meals
  WHERE user_id = _user_id 
    AND date_only = _date;
$$;

-- Função: Resumo Semanal
CREATE OR REPLACE FUNCTION public.get_weekly_summary(
  _user_id UUID,
  _week INTEGER,
  _year INTEGER
)
RETURNS TABLE (
  total_calories INTEGER,
  avg_daily_calories INTEGER,
  meal_count INTEGER,
  days_logged INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH daily_totals AS (
    SELECT 
      date_only,
      SUM(total_calories) as daily_total
    FROM public.user_meals
    WHERE user_id = _user_id 
      AND week_number = _week
      AND EXTRACT(YEAR FROM datetime) = _year
    GROUP BY date_only
  )
  SELECT 
    COALESCE(SUM(daily_total), 0)::INTEGER,
    COALESCE(AVG(daily_total), 0)::INTEGER,
    (SELECT COUNT(*) FROM public.user_meals 
     WHERE user_id = _user_id AND week_number = _week 
     AND EXTRACT(YEAR FROM datetime) = _year)::INTEGER,
    COUNT(*)::INTEGER
  FROM daily_totals;
$$;

-- Função: Resumo Mensal
CREATE OR REPLACE FUNCTION public.get_monthly_summary(
  _user_id UUID,
  _month TEXT
)
RETURNS TABLE (
  total_calories INTEGER,
  avg_daily_calories INTEGER,
  meal_count INTEGER,
  days_logged INTEGER,
  by_meal_type JSONB
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH daily_totals AS (
    SELECT date_only, SUM(total_calories) as daily_total
    FROM public.user_meals
    WHERE user_id = _user_id AND month = _month
    GROUP BY date_only
  ),
  meal_totals AS (
    SELECT meal_name, SUM(total_calories) as meal_total
    FROM public.user_meals
    WHERE user_id = _user_id AND month = _month
    GROUP BY meal_name
  )
  SELECT 
    COALESCE((SELECT SUM(daily_total) FROM daily_totals), 0)::INTEGER,
    COALESCE((SELECT AVG(daily_total) FROM daily_totals), 0)::INTEGER,
    (SELECT COUNT(*) FROM public.user_meals WHERE user_id = _user_id AND month = _month)::INTEGER,
    (SELECT COUNT(*) FROM daily_totals)::INTEGER,
    COALESCE((SELECT JSONB_OBJECT_AGG(meal_name, meal_total) FROM meal_totals), '{}'::jsonb);
$$;