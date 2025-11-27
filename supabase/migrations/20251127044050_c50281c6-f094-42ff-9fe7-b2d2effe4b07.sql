-- Add asaas_customer_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN asaas_customer_id text;