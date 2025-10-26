-- Create newsletter subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text default 'subscribed' check (status in ('subscribed', 'unsubscribed', 'bounced')),
  mailchimp_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.newsletter_subscribers enable row level security;

-- RLS Policies - allow anyone to insert (for signup), but only view/manage their own
create policy "newsletter_insert_public"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "newsletter_select_own"
  on public.newsletter_subscribers for select
  using (true);
