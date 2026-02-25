-- ============================================
-- Add ip_address to respondents + brand_familiar to responses
-- ============================================

-- 1. Store raw IP on respondents (for LOG display + duplicate detection)
ALTER TABLE public.survey_respondents
  ADD COLUMN IF NOT EXISTS ip_address text;

-- 2. Store brand familiarity per stimulus response (true = knows the brand)
ALTER TABLE public.survey_responses
  ADD COLUMN IF NOT EXISTS brand_familiar boolean;
