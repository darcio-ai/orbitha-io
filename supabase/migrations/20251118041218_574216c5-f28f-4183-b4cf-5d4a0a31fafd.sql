-- Allow users to insert their own agent access during signup
CREATE POLICY "Users can insert their own agent access"
ON public.agents_users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);