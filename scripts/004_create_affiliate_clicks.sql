-- Create affiliate clicks table for tracking (Phase 2)
create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address text,
  user_agent text
);

alter table public.affiliate_clicks enable row level security;

-- RLS Policies - only admins can view clicks (will be implemented in Phase 2)
create policy "affiliate_clicks_select_public"
  on public.affiliate_clicks for select
  using (true);
