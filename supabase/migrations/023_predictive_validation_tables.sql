-- Migration 023: Create predictive validation tables for Case Study Validation (Stratul 4)
-- Schema matches exactly the ensureTable() definitions in API routes

-- 1. Companies
CREATE TABLE IF NOT EXISTS public.predictive_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL DEFAULT 'Altele',
  contact_name TEXT,
  contact_email TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.predictive_companies ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'predictive_companies' AND policyname = 'predictive_companies_all') THEN
    CREATE POLICY "predictive_companies_all" ON public.predictive_companies FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 2. Campaigns
CREATE TABLE IF NOT EXISTS public.predictive_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.predictive_companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  period_start DATE,
  period_end DATE,
  budget_eur NUMERIC,
  creative_image_url TEXT,
  creative_link TEXT,
  admin_notes TEXT,
  paired_campaign_id UUID,
  eval1_token TEXT UNIQUE,
  eval2_token TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.predictive_campaigns ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'predictive_campaigns' AND policyname = 'predictive_campaigns_all') THEN
    CREATE POLICY "predictive_campaigns_all" ON public.predictive_campaigns FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 3. Evaluations (2 evaluators per campaign)
CREATE TABLE IF NOT EXISTS public.predictive_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.predictive_campaigns(id) ON DELETE CASCADE,
  evaluator_number SMALLINT NOT NULL CHECK (evaluator_number IN (1, 2)),
  evaluator_name TEXT,
  evaluator_email TEXT,
  evaluator_experience TEXT,
  score_r SMALLINT CHECK (score_r BETWEEN 1 AND 10),
  score_i SMALLINT CHECK (score_i BETWEEN 1 AND 10),
  score_f SMALLINT CHECK (score_f BETWEEN 1 AND 10),
  score_cta SMALLINT CHECK (score_cta BETWEEN 1 AND 10),
  score_c NUMERIC GENERATED ALWAYS AS (score_r + score_i * score_f) STORED,
  comment_r TEXT,
  comment_i TEXT,
  comment_f TEXT,
  comment_cta TEXT,
  gate_triggered BOOLEAN GENERATED ALWAYS AS (score_r IS NOT NULL AND score_r < 3) STORED,
  current_screen SMALLINT NOT NULL DEFAULT 1,
  time_spent_scoring_sec INTEGER,
  time_spent_kpi_sec INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, evaluator_number)
);
ALTER TABLE public.predictive_evaluations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'predictive_evaluations' AND policyname = 'predictive_evaluations_all') THEN
    CREATE POLICY "predictive_evaluations_all" ON public.predictive_evaluations FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 4. KPIs (linked to evaluation, not campaign)
CREATE TABLE IF NOT EXISTS public.predictive_kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID NOT NULL REFERENCES public.predictive_evaluations(id) ON DELETE CASCADE,
  kpi_name TEXT NOT NULL,
  kpi_value NUMERIC NOT NULL,
  kpi_unit TEXT NOT NULL DEFAULT '',
  data_source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.predictive_kpis ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'predictive_kpis' AND policyname = 'predictive_kpis_all') THEN
    CREATE POLICY "predictive_kpis_all" ON public.predictive_kpis FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
