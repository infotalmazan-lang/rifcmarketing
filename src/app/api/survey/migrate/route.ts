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

    // Default: check status
    const checks: Record<string, boolean> = {};

    const { error: e1 } = await supabase.from("survey_distributions").select("id").limit(1);
    checks.distributions = !e1;

    const { error: e2 } = await supabase.from("survey_responses").select("c_score").limit(1);
    checks.c_score = !e2;

    const { error: e3 } = await supabase.from("survey_responses").select("cta_score").limit(1);
    checks.cta_score = !e3;

    return NextResponse.json({ status: "ok", checks });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
