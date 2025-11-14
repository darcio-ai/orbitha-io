-- Create RPC to fetch agents accessible to current user, bypassing RLS safely
CREATE OR REPLACE FUNCTION public.get_user_agents()
RETURNS SETOF public.agents
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.*
  FROM public.agents a
  JOIN public.agents_users au ON au.agent_id = a.id
  WHERE au.user_id = auth.uid()
    AND a.status = 'active'::agent_status
$$;

-- Ensure only authenticated clients can execute
REVOKE ALL ON FUNCTION public.get_user_agents() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_agents() TO authenticated;