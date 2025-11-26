ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS plan_type TEXT,
ADD COLUMN IF NOT EXISTS billing_provider TEXT,
ADD COLUMN IF NOT EXISTS billing_provider_subscription_id TEXT;
