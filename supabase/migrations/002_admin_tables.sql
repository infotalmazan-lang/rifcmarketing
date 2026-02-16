-- RIFCMARKETING Admin Panel Tables
-- Migration 002
-- Created: 2026-02-16

-- ============================================
-- 1. CONTENT OVERRIDES (CMS for i18n keys)
-- ============================================
create table public.content_overrides (
  id uuid primary key default uuid_generate_v4(),
  locale text not null default 'ro' check (locale in ('ro', 'en')),
  key_path text not null,
  value text not null,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  unique(locale, key_path)
);

alter table public.content_overrides enable row level security;

create policy "Content overrides are readable by everyone"
  on public.content_overrides for select using (true);

create policy "Only admins can manage content overrides"
  on public.content_overrides for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 2. SEO OVERRIDES (per-page meta management)
-- ============================================
create table public.seo_overrides (
  id uuid primary key default uuid_generate_v4(),
  page_path text not null unique,
  meta_title text,
  meta_description text,
  og_image_url text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

alter table public.seo_overrides enable row level security;

create policy "SEO overrides are readable by everyone"
  on public.seo_overrides for select using (true);

create policy "Only admins can manage SEO overrides"
  on public.seo_overrides for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 3. ADD admin_notes TO consulting_requests
-- ============================================
alter table public.consulting_requests add column if not exists admin_notes text;

-- ============================================
-- 4. ADMIN SELECT POLICY ON calculations
-- ============================================
create policy "Admins can view all calculations"
  on public.calculations for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 5. ADMIN SELECT/DELETE ON downloads
-- ============================================
create policy "Admins can view all downloads"
  on public.downloads for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- 6. STORAGE BUCKET for resources
-- ============================================
insert into storage.buckets (id, name, public)
  values ('resources', 'resources', true)
  on conflict (id) do nothing;

create policy "Admins can upload to resources"
  on storage.objects for insert with check (
    bucket_id = 'resources' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can read resources"
  on storage.objects for select using (bucket_id = 'resources');

create policy "Admins can delete resources"
  on storage.objects for delete using (
    bucket_id = 'resources' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
