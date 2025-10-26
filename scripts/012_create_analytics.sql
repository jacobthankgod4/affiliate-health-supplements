-- Create analytics table for tracking affiliate performance
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  click_count integer default 0,
  conversion_count integer default 0,
  revenue decimal(10, 2) default 0,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, date)
);

alter table public.analytics enable row level security;

create policy "analytics_select_admin"
  on public.analytics for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
