-- ============================================
-- SURVEY CATEGORIES
-- Marketing channel categories for organizing stimuli
-- ============================================
create table public.survey_categories (
  id uuid primary key default uuid_generate_v4(),
  type text not null unique check (type in (
    'LP','Social','Email','Ads','Video','Billboard','Print','SMS','PitchDeck','Radio'
  )),
  label text not null,
  short_code text not null,
  color text not null default '#6B7280',
  display_order smallint not null default 0,
  is_visible boolean not null default true,
  max_materials smallint not null default 3,
  created_at timestamptz not null default now()
);

alter table public.survey_categories enable row level security;

create policy "Categories viewable by everyone"
  on public.survey_categories for select using (true);

create policy "Categories updatable by everyone"
  on public.survey_categories for update using (true);

create policy "Categories insertable by everyone"
  on public.survey_categories for insert with check (true);

create policy "Categories deletable by everyone"
  on public.survey_categories for delete using (true);

create index idx_survey_categories_order on public.survey_categories(display_order);

-- Also add full CRUD policies for survey_stimuli (currently only select exists)
create policy "Stimuli insertable by everyone"
  on public.survey_stimuli for insert with check (true);

create policy "Stimuli updatable by everyone"
  on public.survey_stimuli for update using (true);

create policy "Stimuli deletable by everyone"
  on public.survey_stimuli for delete using (true);

-- Drop the restrictive select policy and create an open one
drop policy if exists "Active stimuli viewable by everyone" on public.survey_stimuli;
create policy "Stimuli viewable by everyone"
  on public.survey_stimuli for select using (true);

-- ============================================
-- SEED: 10 default categories
-- ============================================
insert into public.survey_categories (type, label, short_code, color, display_order) values
  ('LP',        'Landing Page (Site)',  'LP',        '#DC2626', 1),
  ('Social',    'Social Media',         'Social',    '#2563EB', 2),
  ('Video',     'Video Advertising',    'Video',     '#7C3AED', 3),
  ('Email',     'Email Marketing',      'Email',     '#059669', 4),
  ('Billboard', 'Billboard / Outdoor',  'Billboard', '#D97706', 5),
  ('Print',     'Print Advertising',    'Print',     '#6366f1', 6),
  ('SMS',       'SMS Marketing',        'SMS',       '#EC4899', 7),
  ('Ads',       'Display / Programmatic','Ads',      '#0891B2', 8),
  ('PitchDeck', 'Pitch Deck',           'Pitch',     '#4338CA', 9),
  ('Radio',     'Radio / Audio',        'Radio',     '#B45309', 10);
