-- ============================================
-- Add audio_url column to survey_stimuli
-- Supports MP3/audio files for Radio and other categories
-- ============================================
ALTER TABLE public.survey_stimuli
  ADD COLUMN IF NOT EXISTS audio_url text;
