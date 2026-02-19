import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

/**
 * Migration endpoint. POST /api/survey/migrate
 * Checks current schema and reports what needs to be done.
 * Also attempts simple column additions via PostgREST workarounds.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const migration = body.migration || "check";
    const supabase = createServiceRole();

    if (migration === "008" || migration === 8) {
      // Migration 008: Add c_score and cta_score to survey_responses
      // PostgREST can't run DDL, so we test if columns exist by selecting them
      const { error: testErr } = await supabase
        .from("survey_responses")
        .select("c_score, cta_score")
        .limit(1);

      if (testErr) {
        return NextResponse.json({
          migrated: false,
          error: "Columns c_score/cta_score don't exist yet.",
          action: "Run the following SQL in Supabase Dashboard > SQL Editor:",
          sql: `-- Migration 008: Add c_score and cta_score
ALTER TABLE public.survey_responses
  ADD COLUMN IF NOT EXISTS c_score smallint check (c_score >= 1 and c_score <= 10),
  ADD COLUMN IF NOT EXISTS cta_score smallint check (cta_score >= 1 and cta_score <= 10);

ALTER TABLE public.survey_ai_evaluations
  ADD COLUMN IF NOT EXISTS c_score numeric(4,2),
  ADD COLUMN IF NOT EXISTS cta_score numeric(4,2);

ALTER TABLE public.expert_evaluations
  ADD COLUMN IF NOT EXISTS c_score numeric(4,2),
  ADD COLUMN IF NOT EXISTS cta_score numeric(4,2);

-- Allow upsert (update) on survey_responses
DO $$ BEGIN
  CREATE POLICY "Anyone can update own response"
    ON public.survey_responses FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;`,
        });
      }

      return NextResponse.json({
        migrated: true,
        message: "Migration 008 already applied. Columns c_score and cta_score exist.",
      });
    }

    if (migration === "015" || migration === 15) {
      // Migration 015: Add locale column to survey_respondents
      const { error: testErr } = await supabase
        .from("survey_respondents")
        .select("locale")
        .limit(1);

      if (testErr) {
        return NextResponse.json({
          migrated: false,
          error: "Column locale doesn't exist yet.",
          action: "Run the following SQL in Supabase Dashboard > SQL Editor:",
          sql: `-- Migration 015: Add locale column
ALTER TABLE public.survey_respondents
  ADD COLUMN IF NOT EXISTS locale text DEFAULT 'ro';`,
        });
      }

      return NextResponse.json({
        migrated: true,
        message: "Migration 015 already applied. Column locale exists.",
      });
    }

    if (migration === "016" || migration === 16) {
      // Migration 016: Add ip_address to respondents + brand_familiar to responses
      const { error: e1 } = await supabase.from("survey_respondents").select("ip_address").limit(1);
      const { error: e2 } = await supabase.from("survey_responses").select("brand_familiar").limit(1);

      if (e1 || e2) {
        return NextResponse.json({
          migrated: false,
          missing: { ip_address: !!e1, brand_familiar: !!e2 },
          action: "Run the following SQL in Supabase Dashboard > SQL Editor:",
          sql: `-- Migration 016: Add ip_address + brand_familiar
ALTER TABLE public.survey_respondents
  ADD COLUMN IF NOT EXISTS ip_address text;

ALTER TABLE public.survey_responses
  ADD COLUMN IF NOT EXISTS brand_familiar boolean;`,
        });
      }

      return NextResponse.json({
        migrated: true,
        message: "Migration 016 already applied. Columns ip_address and brand_familiar exist.",
      });
    }

    if (migration === "018" || migration === 18) {
      // Migration 018: Add is_archived + archived_at to survey_respondents (soft delete)
      const { error: e1 } = await supabase.from("survey_respondents").select("is_archived").limit(1);
      const { error: e2 } = await supabase.from("survey_respondents").select("archived_at").limit(1);

      if (e1 || e2) {
        return NextResponse.json({
          migrated: false,
          missing: { is_archived: !!e1, archived_at: !!e2 },
          action: "Run the following SQL in Supabase Dashboard > SQL Editor:",
          sql: `-- Migration 018: Add soft-delete archive columns
ALTER TABLE public.survey_respondents
  ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;`,
        });
      }

      return NextResponse.json({
        migrated: true,
        message: "Migration 018 already applied. Columns is_archived and archived_at exist.",
      });
    }

    if (migration === "020" || migration === 20) {
      // Migration 020: Create survey_experts table + extend expert_evaluations
      const { error: e1 } = await supabase.from("survey_experts").select("id").limit(1);
      const { error: e2 } = await supabase.from("survey_expert_evaluations").select("expert_id").limit(1);

      if (e1 || e2) {
        return NextResponse.json({
          migrated: false,
          missing: { survey_experts_table: !!e1, expert_id_column: !!e2 },
          action: "Run the following SQL in Supabase Dashboard > SQL Editor:",
          sql: `-- Migration 020: Expert profiles + extended evaluations

-- 1. Create survey_experts table
CREATE TABLE IF NOT EXISTS public.survey_experts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  photo_url text,
  access_token text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  revoked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 2. RLS: allow service role full access, public read via token
ALTER TABLE public.survey_experts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Service role full access experts" ON public.survey_experts
    FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Extend survey_expert_evaluations with new columns
ALTER TABLE public.survey_expert_evaluations
  ADD COLUMN IF NOT EXISTS expert_id uuid REFERENCES public.survey_experts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS c_score smallint CHECK (c_score >= 1 AND c_score <= 10),
  ADD COLUMN IF NOT EXISTS cta_score smallint CHECK (cta_score >= 1 AND cta_score <= 10),
  ADD COLUMN IF NOT EXISTS c_justification text,
  ADD COLUMN IF NOT EXISTS cta_justification text,
  ADD COLUMN IF NOT EXISTS brand_familiar boolean,
  ADD COLUMN IF NOT EXISTS brand_justification text;

-- 4. Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_experts_token ON public.survey_experts(access_token);
CREATE INDEX IF NOT EXISTS idx_expert_evals_expert ON public.survey_expert_evaluations(expert_id);`,
        });
      }

      return NextResponse.json({
        migrated: true,
        message: "Migration 020 already applied. survey_experts table and expert_id column exist.",
      });
    }

    if (migration === "021" || migration === 21) {
      // Migration 021: Expert professional fields (experience, brands, budget, roles)
      const { error: eTest } = await supabase.from("survey_experts").select("experience_years").limit(1);

      if (eTest) {
        // Auto-execute the migration
        const sql = `
ALTER TABLE public.survey_experts
  ADD COLUMN IF NOT EXISTS experience_years smallint,
  ADD COLUMN IF NOT EXISTS brands_worked text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS total_budget_managed numeric,
  ADD COLUMN IF NOT EXISTS marketing_roles text[] DEFAULT '{}';`;
        const { error: migErr } = await supabase.rpc("exec_sql", { sql_text: sql }).single();
        if (migErr) {
          // If rpc not available, provide SQL for manual execution
          return NextResponse.json({
            migrated: false,
            missing: { expert_professional_fields: true },
            action: "Run the following SQL in Supabase Dashboard > SQL Editor:",
            sql: sql.trim(),
          });
        }
        return NextResponse.json({
          migrated: true,
          message: "Migration 021 applied. Expert professional fields added.",
        });
      }

      return NextResponse.json({
        migrated: true,
        message: "Migration 021 already applied. Expert professional fields exist.",
      });
    }

    // Default: check status
    const checks: Record<string, boolean> = {};

    const { error: e1 } = await supabase.from("survey_distributions").select("id").limit(1);
    checks.distributions = !e1;

    const { error: e2 } = await supabase.from("survey_responses").select("c_score").limit(1);
    checks.c_score = !e2;

    const { error: e3 } = await supabase.from("survey_responses").select("cta_score").limit(1);
    checks.cta_score = !e3;

    const { error: e4 } = await supabase.from("survey_respondents").select("ip_address").limit(1);
    checks.ip_address = !e4;

    const { error: e5 } = await supabase.from("survey_responses").select("brand_familiar").limit(1);
    checks.brand_familiar = !e5;

    const { error: e6 } = await supabase.from("survey_respondents").select("is_archived").limit(1);
    checks.is_archived = !e6;

    const { error: e7 } = await supabase.from("survey_experts").select("id").limit(1);
    checks.survey_experts = !e7;

    const { error: e8 } = await supabase.from("survey_expert_evaluations").select("expert_id").limit(1);
    checks.expert_id = !e8;

    return NextResponse.json({ status: "ok", checks });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
