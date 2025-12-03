-- Create sales table for tracking all sales/transactions
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('subscription', 'one_time', 'service')),
  acquisition_channel TEXT NOT NULL CHECK (acquisition_channel IN ('organic', 'paid_ads', 'referral', 'direct', 'social_media', 'email', 'other')),
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'cancelled')),
  payment_method TEXT,
  external_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Only admins can manage sales
CREATE POLICY "Admins can manage all sales" ON public.sales
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_sales_created_at ON public.sales(created_at);
CREATE INDEX idx_sales_user_id ON public.sales(user_id);
CREATE INDEX idx_sales_status ON public.sales(status);

-- Trigger to update updated_at
CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();