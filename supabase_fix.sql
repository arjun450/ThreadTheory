-- ============================================================
-- ThreadTheory — Trigger Fix for "database error saving new user"
-- ============================================================

-- Drop and recreate the trigger function with proper search_path
-- (required by Supabase for SECURITY DEFINER functions)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block signup
    RAISE LOG 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Allow inserts into profiles (needed for trigger to work)
DROP POLICY IF EXISTS "Allow insert for trigger" ON public.profiles;
CREATE POLICY "Allow insert for trigger" ON public.profiles
  FOR INSERT WITH CHECK (true);
