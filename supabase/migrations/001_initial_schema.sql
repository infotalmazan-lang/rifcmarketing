-- RIFCMARKETING Database Schema
-- Supabase PostgreSQL Migration
-- Created: 2026-02-15

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  company text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 2. BLOG CATEGORIES
-- ============================================
create table public.blog_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0
);

alter table public.blog_categories enable row level security;

create policy "Blog categories are viewable by everyone"
  on public.blog_categories for select using (true);

create policy "Only admins can manage categories"
  on public.blog_categories for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed categories
insert into public.blog_categories (name, slug, description, sort_order) values
  ('Framework', 'framework', 'Core R IF C methodology and theory', 1),
  ('Case Studies', 'case-studies', 'Real-world applications and results', 2),
  ('Tutorials', 'tutorials', 'Step-by-step guides and how-tos', 3),
  ('Industry', 'industry', 'Marketing industry analysis and trends', 4);

-- ============================================
-- 3. BLOG POSTS
-- ============================================
create table public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  featured_image text,
  category_id uuid references public.blog_categories(id),
  tags text[] default '{}',
  author_name text not null default 'Dumitru Talmazan',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  meta_title text,
  meta_description text
);

alter table public.blog_posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.blog_posts for select using (is_published = true);

create policy "Admins can manage all posts"
  on public.blog_posts for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index idx_blog_posts_slug on public.blog_posts(slug);
create index idx_blog_posts_published on public.blog_posts(is_published, published_at desc);
create index idx_blog_posts_category on public.blog_posts(category_id);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure public.update_updated_at();

-- ============================================
-- 4. CALCULATIONS
-- ============================================
create table public.calculations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  r_score smallint not null check (r_score >= 1 and r_score <= 10),
  i_score smallint not null check (i_score >= 1 and i_score <= 10),
  f_score smallint not null check (f_score >= 1 and f_score <= 10),
  c_score smallint not null generated always as (r_score + i_score * f_score) stored,
  channel text,
  notes text,
  diagnosis text,
  created_at timestamptz not null default now()
);

alter table public.calculations enable row level security;

create policy "Users can view own calculations"
  on public.calculations for select using (auth.uid() = user_id);

create policy "Users can insert own calculations"
  on public.calculations for insert with check (auth.uid() = user_id);

create policy "Users can delete own calculations"
  on public.calculations for delete using (auth.uid() = user_id);

create index idx_calculations_user on public.calculations(user_id, created_at desc);

-- ============================================
-- 5. RESOURCES
-- ============================================
create table public.resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  file_url text,
  file_size text,
  type text not null check (type in ('whitepaper', 'template', 'card', 'paper')),
  status text not null default 'coming_soon' check (status in ('available', 'coming_soon', 'in_development')),
  download_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "Resources are viewable by everyone"
  on public.resources for select using (true);

create policy "Only admins can manage resources"
  on public.resources for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed resources
insert into public.resources (title, description, type, status) values
  ('White Paper (Source Code)', 'The complete R IF C Protocol — philosophy, methodology, scoring system, and implementation guide. The foundational document.', 'whitepaper', 'available'),
  ('Scoring Template', 'Ready-to-use spreadsheet with automated C score calculation, Relevance Gate trigger, and financial impact estimation per campaign.', 'template', 'coming_soon'),
  ('Quick Diagnostic Card', 'One-page printable reference. The equation, variable definitions, scoring scale, and 4-question checklist. Pin it to your wall.', 'card', 'coming_soon'),
  ('Scientific Paper', 'Peer-reviewed academic publication with empirical validation, methodology, and comparative analysis against existing frameworks.', 'paper', 'in_development');

-- ============================================
-- 6. CASE STUDIES
-- ============================================
create table public.case_studies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  industry text not null,
  description text not null,
  before_r smallint not null,
  before_i smallint not null,
  before_f smallint not null,
  before_c smallint not null,
  after_r smallint not null,
  after_i smallint not null,
  after_f smallint not null,
  after_c smallint not null,
  metric_improvement text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.case_studies enable row level security;

create policy "Published case studies are viewable by everyone"
  on public.case_studies for select using (is_published = true);

create policy "Only admins can manage case studies"
  on public.case_studies for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 7. NEWSLETTER SUBSCRIBERS
-- ============================================
create table public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  confirmed boolean not null default false,
  unsubscribed_at timestamptz
);

alter table public.newsletter_subscribers enable row level security;

-- Anyone can subscribe (insert)
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert with check (true);

-- Only admins can view subscribers
create policy "Only admins can view subscribers"
  on public.newsletter_subscribers for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 8. CONSULTING REQUESTS
-- ============================================
create table public.consulting_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  phone text,
  message text not null,
  budget_range text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.consulting_requests enable row level security;

-- Anyone can submit a request
create policy "Anyone can submit consulting request"
  on public.consulting_requests for insert with check (true);

-- Only admins can view/manage requests
create policy "Only admins can view consulting requests"
  on public.consulting_requests for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update consulting requests"
  on public.consulting_requests for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 9. DOWNLOADS (tracking)
-- ============================================
create table public.downloads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  resource_id uuid references public.resources(id) on delete cascade not null,
  email text,
  downloaded_at timestamptz not null default now()
);

alter table public.downloads enable row level security;

create policy "Users can view own downloads"
  on public.downloads for select using (auth.uid() = user_id);

create policy "Anyone can insert download record"
  on public.downloads for insert with check (true);

-- Increment download count on insert
create or replace function public.increment_download_count()
returns trigger as $$
begin
  update public.resources set download_count = download_count + 1 where id = new.resource_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_download_created
  after insert on public.downloads
  for each row execute procedure public.increment_download_count();

-- ============================================
-- 10. BOOKMARKS
-- ============================================
create table public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  blog_post_id uuid references public.blog_posts(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, blog_post_id)
);

alter table public.bookmarks enable row level security;

create policy "Users can view own bookmarks"
  on public.bookmarks for select using (auth.uid() = user_id);

create policy "Users can manage own bookmarks"
  on public.bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete using (auth.uid() = user_id);

create index idx_bookmarks_user on public.bookmarks(user_id, created_at desc);
