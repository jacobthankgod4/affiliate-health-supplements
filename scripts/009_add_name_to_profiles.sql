-- Add name field to profiles table
alter table public.profiles add column if not exists full_name text;

-- Update existing profiles to have a default name
update public.profiles set full_name = 'User' where full_name is null;

-- Make the column not null
alter table public.profiles alter column full_name set not null;
