-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  price decimal(10, 2) not null,
  affiliate_link text not null,
  image_url text,
  rating decimal(3, 2),
  review_count integer default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

-- RLS Policies - allow anyone to view products
create policy "products_select_public"
  on public.products for select
  using (true);
