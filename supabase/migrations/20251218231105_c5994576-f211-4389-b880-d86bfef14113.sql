-- Remove o check constraint que está limitando os valores do plan
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;