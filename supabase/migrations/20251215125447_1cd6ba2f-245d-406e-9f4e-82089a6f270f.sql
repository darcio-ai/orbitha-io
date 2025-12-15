-- Create ai_usage_logs table for tracking token consumption and costs
CREATE TABLE public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  function_name TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (prompt_tokens + completion_tokens) STORED,
  estimated_cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all logs
CREATE POLICY "Admins can view all AI usage logs"
ON public.ai_usage_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert logs (for edge functions using service role)
CREATE POLICY "Service role can insert AI usage logs"
ON public.ai_usage_logs
FOR INSERT
WITH CHECK (true);

-- Users can view their own logs
CREATE POLICY "Users can view their own AI usage logs"
ON public.ai_usage_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Block anonymous access
CREATE POLICY "Block anonymous access to ai_usage_logs"
ON public.ai_usage_logs
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create index for common queries
CREATE INDEX idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at DESC);
CREATE INDEX idx_ai_usage_logs_model ON public.ai_usage_logs(model);
CREATE INDEX idx_ai_usage_logs_function_name ON public.ai_usage_logs(function_name);