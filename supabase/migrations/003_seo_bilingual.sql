-- RIFCMARKETING: Add locale support to SEO overrides
-- Migration 003
-- Created: 2026-02-16

-- 1. Add locale column with default 'ro'
alter table public.seo_overrides add column if not exists locale text not null default 'ro' check (locale in ('ro', 'en'));

-- 2. Drop old unique constraint on page_path alone
alter table public.seo_overrides drop constraint if exists seo_overrides_page_path_key;

-- 3. Add new unique constraint on (page_path, locale)
alter table public.seo_overrides add constraint seo_overrides_page_path_locale_key unique (page_path, locale);
