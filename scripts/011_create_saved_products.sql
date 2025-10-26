-- Create saved products table for user favorites
create table if not exists public.saved_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

alter table public.saved_products enable row level security;

create policy "saved_products_select_own"
  on public.saved_products for select
  using (auth.uid() = user_id);

create policy "saved_products_insert_own"
  on public.saved_products for insert
  with check (auth.uid() = user_id);

create policy "saved_products_delete_own"
  on public.saved_products for delete
  using (auth.uid() = user_id);
