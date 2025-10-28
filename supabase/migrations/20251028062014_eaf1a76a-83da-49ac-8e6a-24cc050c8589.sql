-- Auto-promote first user to admin
CREATE OR REPLACE FUNCTION public.handle_first_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the first user (no admins exist)
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to auto-promote first user
CREATE TRIGGER on_auth_user_created_first_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_first_user();

-- Add image_url column to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS image_url text;