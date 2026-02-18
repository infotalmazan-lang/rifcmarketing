-- ============================================
-- RENAME CATEGORIES
-- LP → Site, Print → Ambalaj, Ads → Google,
-- PitchDeck → RadioTV, Radio → Influencer
-- ============================================

-- STEP 1: Drop CHECK constraints on both tables
ALTER TABLE public.survey_categories DROP CONSTRAINT IF EXISTS survey_categories_type_check;
ALTER TABLE public.survey_stimuli DROP CONSTRAINT IF EXISTS survey_stimuli_type_check;

-- STEP 2: Update type values in survey_stimuli FIRST (FK-free, just CHECK was blocking)
UPDATE public.survey_stimuli SET type = 'Site'       WHERE type = 'LP';
UPDATE public.survey_stimuli SET type = 'Ambalaj'    WHERE type = 'Print';
UPDATE public.survey_stimuli SET type = 'Google'     WHERE type = 'Ads';
UPDATE public.survey_stimuli SET type = 'RadioTV'    WHERE type = 'PitchDeck';
UPDATE public.survey_stimuli SET type = 'Influencer' WHERE type = 'Radio';

-- STEP 3: Update type + label + short_code in survey_categories
UPDATE public.survey_categories SET type = 'Site',       label = 'Site / Landing Page',    short_code = 'Site'       WHERE type = 'LP';
UPDATE public.survey_categories SET type = 'Ambalaj',    label = 'Ambalaj / Etichetă',     short_code = 'Ambalaj'    WHERE type = 'Print';
UPDATE public.survey_categories SET type = 'Google',     label = 'Google ADS',              short_code = 'Google'     WHERE type = 'Ads';
UPDATE public.survey_categories SET type = 'RadioTV',    label = 'Spoturi Radio / TV',      short_code = 'Radio/TV'   WHERE type = 'PitchDeck';
UPDATE public.survey_categories SET type = 'Influencer', label = 'Influence Marketing',     short_code = 'Influencer' WHERE type = 'Radio';

-- Also update display_order to match new arrangement:
-- 01 Social, 02 Site, 03 Video, 04 Email, 05 Billboard, 06 SMS, 07 Ambalaj, 08 Google, 09 RadioTV, 10 Influencer
UPDATE public.survey_categories SET display_order = 1  WHERE type = 'Social';
UPDATE public.survey_categories SET display_order = 2  WHERE type = 'Site';
UPDATE public.survey_categories SET display_order = 3  WHERE type = 'Video';
UPDATE public.survey_categories SET display_order = 4  WHERE type = 'Email';
UPDATE public.survey_categories SET display_order = 5  WHERE type = 'Billboard';
UPDATE public.survey_categories SET display_order = 6  WHERE type = 'SMS';
UPDATE public.survey_categories SET display_order = 7  WHERE type = 'Ambalaj';
UPDATE public.survey_categories SET display_order = 8  WHERE type = 'Google';
UPDATE public.survey_categories SET display_order = 9  WHERE type = 'RadioTV';
UPDATE public.survey_categories SET display_order = 10 WHERE type = 'Influencer';

-- STEP 4: Re-add CHECK constraints with new values
ALTER TABLE public.survey_categories
  ADD CONSTRAINT survey_categories_type_check
  CHECK (type IN ('Social','Site','Video','Email','Billboard','SMS','Ambalaj','Google','RadioTV','Influencer'));

ALTER TABLE public.survey_stimuli
  ADD CONSTRAINT survey_stimuli_type_check
  CHECK (type IN ('Social','Site','Video','Email','Billboard','SMS','Ambalaj','Google','RadioTV','Influencer'));
