-- Migration 018: Add professional profile columns to survey_experts
-- These columns allow experts to self-edit their professional profile via the public evaluation page.

ALTER TABLE public.survey_experts
  ADD COLUMN IF NOT EXISTS experience_years smallint,
  ADD COLUMN IF NOT EXISTS brands_worked text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS total_budget_managed numeric,
  ADD COLUMN IF NOT EXISTS marketing_roles text[] DEFAULT '{}';
