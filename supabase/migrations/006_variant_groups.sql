-- ============================================
-- VARIANT GROUPS
-- Each respondent is randomly assigned to A, B, or C
-- Used for between-subjects analysis
-- ============================================
alter table public.survey_respondents
  add column if not exists variant_group text check (variant_group in ('A', 'B', 'C'));

create index if not exists idx_respondents_variant on public.survey_respondents(variant_group);
