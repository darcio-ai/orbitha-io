-- Assign admin role to darciog@gmail.com
-- This migration adds the admin role to the user if it doesn't exist yet

INSERT INTO public.user_roles (user_id, role)
VALUES ('4e16daf0-a856-4d09-a107-127729e19b46', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;