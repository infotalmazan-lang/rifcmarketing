import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TABLE = "predictive_kpis";

async function ensureTable(supabase: ReturnType<typeof createServiceRole>) {
  await supabase.rpc("exec_sql", {
    sql_text: `
      CREATE TABLE IF NOT EXISTS public.${TABLE} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        evaluation_id UUID NOT NULL REFERENCES public.predictive_evaluations(id) ON DELETE CASCADE,
        kpi_name TEXT NOT NULL,
        kpi_value NUMERIC NOT NULL,
        kpi_unit TEXT NOT NULL DEFAULT '',
        data_source TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE public.${TABLE} ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '${TABLE}' AND policyname = '${TABLE}_all') THEN
          CREATE POLICY "${TABLE}_all" ON public.${TABLE} FOR ALL USING (true) WITH CHECK (true);
        END IF;
      END $$;
      NOTIFY pgrst, 'reload schema';
    `,
  }).then(() => {}, () => {});
}

// GET — by evaluation_id or campaign_id
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const evaluationId = searchParams.get("evaluation_id");
    const campaignId = searchParams.get("campaign_id");

    if (evaluationId) {
      const { data, error } = await supabase.from(TABLE).select("*").eq("evaluation_id", evaluationId).order("created_at");
      if (error) {
        if (error.code === "42P01") { await ensureTable(supabase); return NextResponse.json({ success: true, kpis: [] }); }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, kpis: data || [] });
    }

    if (campaignId) {
      // Get all KPIs for all evaluations of this campaign
      const { data: evals } = await supabase.from("predictive_evaluations").select("id").eq("campaign_id", campaignId);
      if (!evals || evals.length === 0) return NextResponse.json({ success: true, kpis: [] });
      const evalIds = evals.map((e: { id: string }) => e.id);
      const { data, error } = await supabase.from(TABLE).select("*").in("evaluation_id", evalIds).order("created_at");
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, kpis: data || [] });
    }

    // Return all
    const { data, error } = await supabase.from(TABLE).select("*").order("created_at");
    if (error) {
      if (error.code === "42P01") { await ensureTable(supabase); return NextResponse.json({ success: true, kpis: [] }); }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, kpis: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — create/upsert KPI
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { evaluation_id, kpi_name, kpi_value, kpi_unit, data_source, notes } = body;

    if (!evaluation_id || !kpi_name || kpi_value === undefined) {
      return NextResponse.json({ error: "evaluation_id, kpi_name, kpi_value required" }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      evaluation_id, kpi_name, kpi_value,
      kpi_unit: kpi_unit || "",
      data_source: data_source || null,
      notes: notes || null,
    };

    const { data, error } = await supabase.from(TABLE).insert(insertData).select().single();
    if (error) {
      if (error.code === "42P01") {
        await ensureTable(supabase);
        const retry = await supabase.from(TABLE).insert(insertData).select().single();
        if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
        return NextResponse.json({ success: true, kpi: retry.data });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, kpi: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — delete KPI by id
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
