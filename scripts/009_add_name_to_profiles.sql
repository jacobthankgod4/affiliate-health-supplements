-- Add name field to profiles table
alter table public.profiles add column if not exists name text;

-- Update existing profiles to have a default name
update public.profiles set name = 'User' where name is null;

-- Make the column not null
alter table public.profiles alter column name set not null;
