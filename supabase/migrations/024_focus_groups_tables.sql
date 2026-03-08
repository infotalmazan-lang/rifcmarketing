-- ═══════════════════════════════════════════════════════════
-- Migration 024: Focus Groups (Stratul 4 — Calitativ)
-- 5 tables: focus_groups, focus_participants, focus_themes,
--           focus_stimuli_selection, focus_codes
-- ═══════════════════════════════════════════════════════════

-- 1. FOCUS GROUPS (main table, 4 pre-seeded groups)
CREATE TABLE IF NOT EXISTS public.focus_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_number INT NOT NULL CHECK (group_number BETWEEN 1 AND 4),
  group_name TEXT NOT NULL,
  group_label TEXT NOT NULL,
  target_participants INT NOT NULL DEFAULT 10,

  -- Session
  session_date DATE,
  session_time TIME,
  location_type TEXT CHECK (location_type IN ('oficiu', 'utm', 'usm', 'alt')),
  location_address TEXT,
  duration_planned_min INT DEFAULT 80,
  duration_actual_min INT,

  -- Recording
  recording_device_1 TEXT,
  recording_device_2 TEXT,
  recording_file_1_url TEXT,
  recording_file_2_url TEXT,

  -- Post-session
  participants_present INT,
  post_session_notes TEXT,

  -- Transcript
  transcript_file_url TEXT,
  transcript_word_count INT,
  transcript_status TEXT DEFAULT 'not_started'
    CHECK (transcript_status IN ('not_started', 'in_progress', 'transcribed', 'verified')),
  transcript_deadline TIMESTAMPTZ,
  transcript_verified_by TEXT,
  transcript_verified_pct INT CHECK (transcript_verified_pct BETWEEN 0 AND 100),
  transcript_verification_quality TEXT CHECK (transcript_verification_quality IN ('exact', 'minor_differences', 'major_issues')),
  anonymization_status TEXT DEFAULT 'not_started'
    CHECK (anonymization_status IN ('not_started', 'in_progress', 'complete')),

  -- Coding / Analysis
  coding_status TEXT DEFAULT 'not_started'
    CHECK (coding_status IN ('not_started', 'coder1_done', 'coder2_done', 'both_done', 'reconciled')),
  kappa_score NUMERIC,
  kappa_level TEXT,

  -- Overall
  overall_status TEXT DEFAULT 'recruitment'
    CHECK (overall_status IN ('recruitment', 'scheduled', 'completed', 'transcribing', 'coding', 'analyzed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pre-seed the 4 groups
INSERT INTO public.focus_groups (group_number, group_name, group_label) VALUES
  (1, 'antreprenori', 'Antreprenori'),
  (2, 'useri_generali', 'Useri Generali'),
  (3, 'marketeri', 'Marketeri'),
  (4, 'studenti', 'Studenti')
ON CONFLICT DO NOTHING;

-- 2. FOCUS PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.focus_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.focus_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  profile_short TEXT,
  marketing_experience TEXT CHECK (marketing_experience IN ('none', '1-2', '3-5', '5-10', '10+')),
  consent_signed BOOLEAN DEFAULT FALSE,
  consent_date DATE,
  invited_date DATE,
  confirmed BOOLEAN DEFAULT FALSE,
  confirmed_date DATE,
  present BOOLEAN DEFAULT FALSE,
  anonymous_id TEXT,
  member_check_selected BOOLEAN DEFAULT FALSE,
  member_check_done BOOLEAN DEFAULT FALSE,
  member_check_date DATE,
  member_check_feedback TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-generate anonymous_id (A1, U2, M3, S4...)
CREATE OR REPLACE FUNCTION generate_anonymous_id()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  count_in_group INT;
BEGIN
  SELECT CASE
    WHEN fg.group_name = 'antreprenori' THEN 'A'
    WHEN fg.group_name = 'useri_generali' THEN 'U'
    WHEN fg.group_name = 'marketeri' THEN 'M'
    WHEN fg.group_name = 'studenti' THEN 'S'
    ELSE 'X'
  END INTO prefix
  FROM public.focus_groups fg WHERE fg.id = NEW.group_id;

  SELECT COUNT(*) + 1 INTO count_in_group
  FROM public.focus_participants WHERE group_id = NEW.group_id;

  NEW.anonymous_id := prefix || count_in_group;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_anonymous_id ON public.focus_participants;
CREATE TRIGGER set_anonymous_id
  BEFORE INSERT ON public.focus_participants
  FOR EACH ROW EXECUTE FUNCTION generate_anonymous_id();

-- 3. FOCUS THEMES (created before focus_codes because codes reference themes)
CREATE TABLE IF NOT EXISTS public.focus_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_number INT NOT NULL,
  theme_name TEXT NOT NULL,
  theme_description TEXT,
  rifc_dimension TEXT CHECK (rifc_dimension IN ('R', 'I', 'F', 'C', 'formula', 'gate', 'archetype', 'utility', 'other')),
  present_in_groups JSONB DEFAULT '{}',
  representative_quote TEXT,
  representative_participant_anonymous_id TEXT,
  representative_group TEXT,
  codes_count INT DEFAULT 0,
  groups_count INT DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'final')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FOCUS STIMULI SELECTION
CREATE TABLE IF NOT EXISTS public.focus_stimuli_selection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.focus_groups(id) ON DELETE CASCADE,
  stimulus_id UUID,
  stimulus_name TEXT NOT NULL,
  stimulus_image_url TEXT,
  c_score NUMERIC,
  c_category TEXT NOT NULL CHECK (c_category IN ('high', 'medium', 'low')),
  display_order INT,
  spontaneous_preferred BOOLEAN DEFAULT FALSE,
  spontaneous_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FOCUS CODES
CREATE TABLE IF NOT EXISTS public.focus_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.focus_groups(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.focus_participants(id),
  transcript_line_start INT,
  transcript_line_end INT,
  timestamp_marker TEXT,
  quote_text TEXT NOT NULL,
  code_coder1 TEXT,
  code_coder1_date TIMESTAMPTZ,
  code_coder2 TEXT,
  code_coder2_date TIMESTAMPTZ,
  code_agreed TEXT,
  agreement_type TEXT CHECK (agreement_type IN ('identical', 'similar', 'different', 'reconciled')),
  reconciliation_notes TEXT,
  theme_id UUID REFERENCES public.focus_themes(id),
  rifc_dimension TEXT CHECK (rifc_dimension IN ('R', 'I', 'F', 'C', 'formula', 'gate', 'archetype', 'utility', 'other')),
  discussion_module INT CHECK (discussion_module BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_focus_codes_group ON public.focus_codes(group_id);
CREATE INDEX IF NOT EXISTS idx_focus_codes_theme ON public.focus_codes(theme_id);
CREATE INDEX IF NOT EXISTS idx_focus_codes_dimension ON public.focus_codes(rifc_dimension);
CREATE INDEX IF NOT EXISTS idx_focus_themes_dimension ON public.focus_themes(rifc_dimension);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_focus_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS focus_groups_updated ON public.focus_groups;
CREATE TRIGGER focus_groups_updated
  BEFORE UPDATE ON public.focus_groups
  FOR EACH ROW EXECUTE FUNCTION update_focus_updated_at();

DROP TRIGGER IF EXISTS focus_themes_updated ON public.focus_themes;
CREATE TRIGGER focus_themes_updated
  BEFORE UPDATE ON public.focus_themes
  FOR EACH ROW EXECUTE FUNCTION update_focus_updated_at();

-- RLS
ALTER TABLE public.focus_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_stimuli_selection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_codes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'focus_groups' AND policyname = 'focus_groups_all') THEN
    CREATE POLICY "focus_groups_all" ON public.focus_groups FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'focus_participants' AND policyname = 'focus_participants_all') THEN
    CREATE POLICY "focus_participants_all" ON public.focus_participants FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'focus_themes' AND policyname = 'focus_themes_all') THEN
    CREATE POLICY "focus_themes_all" ON public.focus_themes FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'focus_stimuli_selection' AND policyname = 'focus_stimuli_selection_all') THEN
    CREATE POLICY "focus_stimuli_selection_all" ON public.focus_stimuli_selection FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'focus_codes' AND policyname = 'focus_codes_all') THEN
    CREATE POLICY "focus_codes_all" ON public.focus_codes FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
