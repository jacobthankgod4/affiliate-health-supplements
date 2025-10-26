-- Add is_admin column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Create admin user (you'll need to update the UUID with an actual user ID)
-- First, create a user in Supabase Auth, then update their profile:
-- UPDATE public.profiles SET is_admin = true WHERE id = 'USER_UUID_HERE';

-- Add RLS policy for admin access
CREATE POLICY "Admins can view all users" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update all users" ON public.profiles
  FOR UPDATE
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));
