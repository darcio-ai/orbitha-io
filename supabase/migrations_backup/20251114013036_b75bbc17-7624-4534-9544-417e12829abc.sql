-- Create enum for agent status
CREATE TYPE public.agent_status AS ENUM ('active', 'suspended', 'deleted');

-- Create agents table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  prompt TEXT,
  avatar_url TEXT,
  temperature NUMERIC(3,2) CHECK (temperature >= 0 AND temperature <= 1) DEFAULT 0.7,
  model TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  status agent_status NOT NULL DEFAULT 'active',
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admins can see all agents
CREATE POLICY "Admins can view all agents"
ON public.agents
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert agents
CREATE POLICY "Admins can create agents"
ON public.agents
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update agents
CREATE POLICY "Admins can update agents"
ON public.agents
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete agents (soft delete via update)
CREATE POLICY "Admins can delete agents"
ON public.agents
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();