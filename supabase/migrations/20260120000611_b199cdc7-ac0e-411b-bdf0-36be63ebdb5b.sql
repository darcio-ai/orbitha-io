-- Fix overly permissive "Block anonymous access" policies that allow any authenticated user to SELECT all rows
-- These tables are supposed to be admin-only but "Block anonymous access" policy with (auth.uid() IS NOT NULL) 
-- allows ANY authenticated user to see all data

-- Fix agendamentos (appointments) - should be admin-only
DROP POLICY IF EXISTS "Block anonymous access to agendamentos" ON public.agendamentos;

-- Fix clientes (clients) - should be admin-only  
DROP POLICY IF EXISTS "Block anonymous access to clientes" ON public.clientes;

-- Fix sales - should be admin-only
DROP POLICY IF EXISTS "Block anonymous access to sales" ON public.sales;