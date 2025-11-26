-- Assign admin role to darcio@orbitha.io
INSERT INTO public.user_roles (user_id, role)
VALUES ('5f20683c-35cd-4ea5-8f14-cd67807a84ab', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;