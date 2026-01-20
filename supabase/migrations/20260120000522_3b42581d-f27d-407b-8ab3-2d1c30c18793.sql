-- Fix profiles RLS: Remove overly permissive "Block anonymous access" policy
-- The existing owner-scoped and admin policies are sufficient
-- The "Block anonymous access" policy allows ANY authenticated user to SELECT ALL profiles

DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;