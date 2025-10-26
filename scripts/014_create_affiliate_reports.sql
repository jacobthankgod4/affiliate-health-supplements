-- Create affiliate reports table for periodic snapshots
create table if not exists public.affiliate_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  total_clicks integer default 0,
  total_conversions integer default 0,
  total_revenue decimal(10, 2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.affiliate_reports enable row level security;

create policy "affiliate_reports_select_own"
  on public.affiliate_reports for select
  using (auth.uid() = user_id);

create policy "affiliate_reports_select_admin"
  on public.affiliate_reports for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
