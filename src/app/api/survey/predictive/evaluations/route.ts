import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TABLE = "predictive_evaluations";

async function ensureTable(supabase: ReturnType<typeof createServiceRole>) {
  await supabase.rpc("exec_sql", {
    sql_text: `
      CREATE TABLE IF NOT EXISTS public.${TABLE} (
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
      ALTER TABLE public.${TABLE} ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '${TABLE}' AND policyname = '${TABLE}_all') THEN
          CREATE POLICY "${TABLE}_all" ON public.${TABLE} FOR ALL USING (true) WITH CHECK (true);
        END IF;
      END $$;
    `,
  }).then(() => {}, () => {});
}

// GET — list evaluations, optional ?campaign_id=xxx
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const campaignId = new URL(req.url).searchParams.get("campaign_id");

    let query = supabase.from(TABLE).select("*").order("created_at", { ascending: false });
    if (campaignId) query = query.eq("campaign_id", campaignId);

    const { data, error } = await query;
    if (error) {
      if (error.code === "42P01") {
        await ensureTable(supabase);
        return NextResponse.json({ success: true, evaluations: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, evaluations: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — upsert evaluation (by campaign_id + evaluator_number)
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { campaign_id, evaluator_number, ...fields } = body;

    if (!campaign_id || !evaluator_number) {
      return NextResponse.json({ error: "campaign_id, evaluator_number required" }, { status: 400 });
    }

    // Check if evaluation already exists
    const { data: existing } = await supabase.from(TABLE)
      .select("id")
      .eq("campaign_id", campaign_id)
      .eq("evaluator_number", evaluator_number)
      .maybeSingle();

    if (existing) {
      // Update existing
      const { data, error } = await supabase.from(TABLE)
        .update(fields)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, evaluation: data });
    }

    // Insert new
    const insertData = { campaign_id, evaluator_number, ...fields };
    const { data, error } = await supabase.from(TABLE).insert(insertData).select().single();

    if (error) {
      if (error.code === "42P01") {
        await ensureTable(supabase);
        const retry = await supabase.from(TABLE).insert(insertData).select().single();
        if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
        return NextResponse.json({ success: true, evaluation: retry.data });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, evaluation: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update evaluation by id
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { data, error } = await supabase.from(TABLE).update(fields).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, evaluation: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — delete evaluation + its KPIs
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await supabase.from("predictive_kpis").delete().eq("evaluation_id", id);
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
