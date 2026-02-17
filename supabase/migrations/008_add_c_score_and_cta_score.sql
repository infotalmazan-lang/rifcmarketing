-- Migration 008: Add c_score (perceived clarity) and cta_score (action intention)
-- These are participant-reported scores, separate from c_computed (R + I × F formula)

-- Add c_score and cta_score to survey_responses
ALTER TABLE public.survey_responses
  ADD COLUMN IF NOT EXISTS c_score smallint check (c_score >= 1 and c_score <= 10),
  ADD COLUMN IF NOT EXISTS cta_score smallint check (cta_score >= 1 and cta_score <= 10);

-- Add c_score and cta_score to survey_ai_evaluations
ALTER TABLE public.survey_ai_evaluations
  ADD COLUMN IF NOT EXISTS c_score numeric(4,2),
  ADD COLUMN IF NOT EXISTS cta_score numeric(4,2);

-- Add c_score and cta_score to expert_evaluations
ALTER TABLE public.expert_evaluations
  ADD COLUMN IF NOT EXISTS c_score numeric(4,2),
  ADD COLUMN IF NOT EXISTS cta_score numeric(4,2);

-- Allow upsert (update) on survey_responses
CREATE POLICY "Anyone can update own response"
  ON public.survey_responses FOR UPDATE USING (true);
