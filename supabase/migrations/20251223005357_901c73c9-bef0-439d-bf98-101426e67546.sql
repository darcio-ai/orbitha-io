-- Adicionar campos de tracking beta na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_beta_user boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS beta_source text,
ADD COLUMN IF NOT EXISTS beta_assistant_choice text,
ADD COLUMN IF NOT EXISTS beta_expires_at timestamp with time zone;

-- Criar tabela de feedback dos beta testers
CREATE TABLE public.beta_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text text,
  allows_testimonial boolean DEFAULT false,
  allows_screenshot boolean DEFAULT false,
  screenshot_url text,
  assistant_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.beta_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para beta_feedback
CREATE POLICY "Users can insert their own feedback"
ON public.beta_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
ON public.beta_feedback
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
ON public.beta_feedback
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
ON public.beta_feedback
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all feedback"
ON public.beta_feedback
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_beta_feedback_updated_at
BEFORE UPDATE ON public.beta_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_beta_feedback_user_id ON public.beta_feedback(user_id);
CREATE INDEX idx_profiles_is_beta_user ON public.profiles(is_beta_user) WHERE is_beta_user = true;