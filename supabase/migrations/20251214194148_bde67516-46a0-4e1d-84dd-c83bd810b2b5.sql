-- Enable RLS on agent_public_info view
ALTER VIEW public.agent_public_info SET (security_invoker = on);

-- Note: Views in PostgreSQL don't support RLS directly
-- The security is inherited from the underlying table (agents)
-- Since agents table already has proper RLS, the view is secure
-- We'll add a comment to document this security model

COMMENT ON VIEW public.agent_public_info IS 'Public view of agent information. Security is enforced via RLS on the underlying agents table.';