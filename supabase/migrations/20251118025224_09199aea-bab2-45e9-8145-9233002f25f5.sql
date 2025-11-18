-- Add plan and optional fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN plan text DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'enterprise')),
ADD COLUMN age integer,
ADD COLUMN monthly_income numeric,
ADD COLUMN financial_goal text;