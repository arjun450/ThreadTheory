-- Creates a server-side function to get the current user's role
-- Bypasses RLS entirely (SECURITY DEFINER runs as postgres)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;
