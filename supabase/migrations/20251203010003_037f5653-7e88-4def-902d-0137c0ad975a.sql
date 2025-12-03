-- Permitir que usuários autenticados vejam agentes ativos
-- Necessário para o processo de signup funcionar corretamente
CREATE POLICY "Authenticated users can view active agents for signup" 
ON public.agents 
FOR SELECT 
TO authenticated
USING (status = 'active'::agent_status);