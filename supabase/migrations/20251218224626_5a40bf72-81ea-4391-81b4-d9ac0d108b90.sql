-- Create discount type enum
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');

-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type discount_type NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  min_plan_value NUMERIC,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  applicable_plans TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Admins can manage all coupons
CREATE POLICY "Admins can manage all coupons"
ON public.coupons
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view active coupons (for validation)
CREATE POLICY "Authenticated users can view active coupons"
ON public.coupons
FOR SELECT
USING (auth.uid() IS NOT NULL AND active = true);

-- Block anonymous access
CREATE POLICY "Block anonymous access to coupons"
ON public.coupons
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create coupon usage history table
CREATE TABLE public.coupon_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL,
  original_amount NUMERIC NOT NULL,
  discount_amount NUMERIC NOT NULL,
  final_amount NUMERIC NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on coupon_usage
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view their own coupon usage"
ON public.coupon_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all usage
CREATE POLICY "Admins can view all coupon usage"
ON public.coupon_usage
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert usage (via edge function)
CREATE POLICY "Service role can insert coupon usage"
ON public.coupon_usage
FOR INSERT
WITH CHECK (true);

-- Block anonymous access
CREATE POLICY "Block anonymous access to coupon_usage"
ON public.coupon_usage
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Insert test coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, max_uses, valid_from, valid_until, applicable_plans)
VALUES 
  ('TESTE100', 'Cupom de teste 100% desconto', 'percentage', 100, 10, now(), now() + interval '1 year', NULL),
  ('NATAL2024', 'Campanha de Natal 2024 - 30% off', 'percentage', 30, NULL, now(), '2024-12-31 23:59:59+00', NULL),
  ('PRIMEIRACOMPRA', 'Primeira compra - 50% off', 'percentage', 50, NULL, now(), now() + interval '1 year', NULL);