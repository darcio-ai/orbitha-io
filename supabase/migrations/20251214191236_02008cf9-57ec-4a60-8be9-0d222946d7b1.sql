-- Bloquear acesso anônimo às tabelas sensíveis

-- profiles: bloquear leitura anônima
CREATE POLICY "Block anonymous access to profiles" 
ON public.profiles FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- contact_messages: permitir insert público para formulário de contato
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

-- clientes: bloquear acesso anônimo
CREATE POLICY "Block anonymous access to clientes" 
ON public.clientes FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- agendamentos: bloquear acesso anônimo
CREATE POLICY "Block anonymous access to agendamentos" 
ON public.agendamentos FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- agent_messages: bloquear acesso anônimo
CREATE POLICY "Block anonymous access to agent_messages" 
ON public.agent_messages FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- sales: bloquear acesso anônimo
CREATE POLICY "Block anonymous access to sales" 
ON public.sales FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- user_roles: bloquear acesso anônimo
CREATE POLICY "Block anonymous access to user_roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- agents_users: bloquear acesso anônimo
CREATE POLICY "Block anonymous access to agents_users" 
ON public.agents_users FOR SELECT 
USING (auth.uid() IS NOT NULL);