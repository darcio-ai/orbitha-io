-- Create agents_users table to manage user access to agents
CREATE TABLE public.agents_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Enable Row Level Security
ALTER TABLE public.agents_users ENABLE ROW LEVEL SECURITY;

-- Users can view their own agent access
CREATE POLICY "Users can view their own agent access"
ON public.agents_users
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all agent access
CREATE POLICY "Admins can manage all agent access"
ON public.agents_users
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_agents_users_user_id ON public.agents_users(user_id);
CREATE INDEX idx_agents_users_agent_id ON public.agents_users(agent_id);