-- Update affiliate_clicks table to include more tracking data
alter table public.affiliate_clicks add column if not exists product_id uuid references public.products(id) on delete cascade;
alter table public.affiliate_clicks add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.affiliate_clicks add column if not exists conversion boolean default false;
alter table public.affiliate_clicks add column if not exists revenue decimal(10, 2);

-- Create index for better query performance
create index if not exists affiliate_clicks_product_id_idx on public.affiliate_clicks(product_id);
create index if not exists affiliate_clicks_user_id_idx on public.affiliate_clicks(user_id);
create index if not exists affiliate_clicks_created_at_idx on public.affiliate_clicks(created_at);
