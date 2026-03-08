import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const TABLE = "predictive_campaigns";

function generateToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}

async function ensureTable(supabase: ReturnType<typeof createServiceRole>) {
  await supabase.rpc("exec_sql", {
    sql_text: `
      CREATE TABLE IF NOT EXISTS public.${TABLE} (
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

// GET — list all campaigns, optional ?company_id=xxx
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const companyId = new URL(req.url).searchParams.get("company_id");

    let query = supabase.from(TABLE).select("*").order("created_at", { ascending: false });
    if (companyId) query = query.eq("company_id", companyId);

    const { data, error } = await query;
    if (error) {
      if (error.code === "42P01") {
        await ensureTable(supabase);
        return NextResponse.json({ success: true, campaigns: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, campaigns: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — create campaign with auto-generated eval tokens
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { company_id, name, channel, campaign_type, period_start, period_end, budget_eur, creative_image_url, creative_link, admin_notes, paired_campaign_id } = body;

    if (!company_id || !name) {
      return NextResponse.json({ error: "company_id and name required" }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      company_id, name, channel: channel || "Nedefinit", campaign_type: campaign_type || "General",
      eval1_token: generateToken(),
      eval2_token: generateToken(),
    };
    if (period_start) insertData.period_start = period_start;
    if (period_end) insertData.period_end = period_end;
    if (budget_eur) insertData.budget_eur = budget_eur;
    if (creative_image_url) insertData.creative_image_url = creative_image_url;
    if (creative_link) insertData.creative_link = creative_link;
    if (admin_notes) insertData.admin_notes = admin_notes;
    if (paired_campaign_id) insertData.paired_campaign_id = paired_campaign_id;

    const { data, error } = await supabase.from(TABLE).insert(insertData).select().single();

    if (error) {
      if (error.code === "42P01") {
        await ensureTable(supabase);
        const retry = await supabase.from(TABLE).insert(insertData).select().single();
        if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
        return NextResponse.json({ success: true, campaign: retry.data });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, campaign: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update campaign
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { data, error } = await supabase.from(TABLE).update(fields).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, campaign: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — delete campaign (cascades to evaluations + KPIs)
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Delete KPIs via evaluations
    const { data: evals } = await supabase.from("predictive_evaluations").select("id").eq("campaign_id", id);
    if (evals && evals.length > 0) {
      const evalIds = evals.map((e: { id: string }) => e.id);
      await supabase.from("predictive_kpis").delete().in("evaluation_id", evalIds);
    }
    await supabase.from("predictive_evaluations").delete().eq("campaign_id", id);
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
