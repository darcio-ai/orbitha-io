-- Remove admin role from old user
DELETE FROM public.user_roles 
WHERE user_id = '4e16daf0-a856-4d09-a107-127729e19b46' 
AND role = 'admin';

-- Note: To create the new admin user with email darcio@orbitha.io, you need to:
-- 1. Go to the signup page and create a new account with darcio@orbitha.io
-- 2. Then run this second migration to assign admin role to the new user

-- This is a placeholder comment. The actual admin role assignment will be done
-- after the new user signs up through the app interface.