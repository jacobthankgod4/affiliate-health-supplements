-- Create blog_posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  featured_image_url text,
  author_id uuid not null references auth.users(id) on delete cascade,
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blog_posts enable row level security;

-- RLS Policies
create policy "blog_posts_select_public"
  on public.blog_posts for select
  using (published = true);

create policy "blog_posts_select_own"
  on public.blog_posts for select
  using (auth.uid() = author_id);

create policy "blog_posts_insert_admin"
  on public.blog_posts for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "blog_posts_update_admin"
  on public.blog_posts for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "blog_posts_delete_admin"
  on public.blog_posts for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create index for slug lookup
create index blog_posts_slug_idx on public.blog_posts(slug);
create index blog_posts_published_idx on public.blog_posts(published);
