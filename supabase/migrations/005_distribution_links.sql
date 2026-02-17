-- ============================================
-- DISTRIBUTION LINKS
-- Track survey distribution channels/segments
-- Each link has a unique tag appended to the wizard URL
-- ============================================
create table public.survey_distributions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text default '',
  tag text not null unique,
  estimated_completions integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.survey_distributions enable row level security;

create policy "Anyone can view distributions"
  on public.survey_distributions for select using (true);

create policy "Anyone can insert distributions"
  on public.survey_distributions for insert with check (true);

create policy "Anyone can update distributions"
  on public.survey_distributions for update using (true);

create policy "Anyone can delete distributions"
  on public.survey_distributions for delete using (true);

create index idx_distributions_tag on public.survey_distributions(tag);

-- Add distribution_id column to survey_respondents
-- Links each respondent to the distribution channel they came from
alter table public.survey_respondents
  add column distribution_id uuid references public.survey_distributions(id) on delete set null;

create index idx_respondents_distribution on public.survey_respondents(distribution_id);
