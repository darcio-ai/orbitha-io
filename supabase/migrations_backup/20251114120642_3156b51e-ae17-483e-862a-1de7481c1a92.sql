-- Allow users to view only the agents they have explicit access to via agents_users
-- Current issue: nested select returns agents: null due to restrictive RLS on agents
-- Fix: Add a SELECT policy on public.agents for users with mapping in public.agents_users

CREATE POLICY "Users can view agents they have access to"
ON public.agents
FOR SELECT
TO authenticated
USING (
  -- Only active agents should be visible to end users
  status = 'active'::agent_status
  AND EXISTS (
    SELECT 1
    FROM public.agents_users au
    WHERE au.agent_id = id
      AND au.user_id = auth.uid()
  )
);
