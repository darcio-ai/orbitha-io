-- Fix security definer view by explicitly setting SECURITY INVOKER
DROP VIEW IF EXISTS public.agent_public_info;

CREATE VIEW public.agent_public_info 
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  description,
  avatar_url,
  model,
  url,
  status,
  created_at,
  updated_at
FROM public.agents
WHERE status = 'active'::agent_status;