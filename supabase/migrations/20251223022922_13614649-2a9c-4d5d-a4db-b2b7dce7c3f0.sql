-- Adicionar last_seen_at na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamp with time zone;

-- Adicionar colunas de qualidade de feedback e status de depoimento
ALTER TABLE public.beta_feedback 
  ADD COLUMN IF NOT EXISTS feedback_quality text CHECK (feedback_quality IN ('excellent', 'good', 'ok', 'weak', 'useless')),
  ADD COLUMN IF NOT EXISTS testimonial_status text DEFAULT 'pending' CHECK (testimonial_status IN ('priority', 'pending', 'confirmed', 'refused'));