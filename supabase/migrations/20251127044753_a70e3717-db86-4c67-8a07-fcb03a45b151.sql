-- Add billing information columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN cpf_cnpj text,
ADD COLUMN billing_name text;