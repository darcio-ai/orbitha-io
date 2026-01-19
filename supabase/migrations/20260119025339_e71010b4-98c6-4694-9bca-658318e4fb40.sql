-- Alterar coluna recorded_at para incluir horário (TIMESTAMPTZ)
ALTER TABLE public.user_weight_history 
  ALTER COLUMN recorded_at TYPE TIMESTAMPTZ 
  USING recorded_at::TIMESTAMPTZ;

-- Definir default para now() (data+hora atual)
ALTER TABLE public.user_weight_history 
  ALTER COLUMN recorded_at SET DEFAULT now();