-- ============================================
-- Change Print category color from indigo to teal
-- ============================================
UPDATE public.survey_categories
SET color = '#14B8A6'
WHERE type = 'Print';
