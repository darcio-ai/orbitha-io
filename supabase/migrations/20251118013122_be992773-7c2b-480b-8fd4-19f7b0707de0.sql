-- Fix broken RLS policy for agent access
-- The policy was checking au.agent_id = au.id (wrong) instead of au.agent_id = agents.id (correct)

DROP POLICY IF EXISTS "Users can view agents they have access to" ON public.agents;

CREATE POLICY "Users can view agents they have access to" 
ON public.agents 
FOR SELECT 
USING (
  status = 'active'::agent_status 
  AND EXISTS (
    SELECT 1 
    FROM public.agents_users au 
    WHERE au.agent_id = agents.id 
    AND au.user_id = auth.uid()
  )
);