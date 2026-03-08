import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TABLE = "predictive_companies";

async function ensureTable(supabase: ReturnType<typeof createServiceRole>) {
  await supabase.rpc("exec_sql", {
    sql_text: `
      CREATE TABLE IF NOT EXISTS public.${TABLE} (
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
      ALTER TABLE public.${TABLE} ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = '${TABLE}' AND policyname = '${TABLE}_all') THEN
          CREATE POLICY "${TABLE}_all" ON public.${TABLE} FOR ALL USING (true) WITH CHECK (true);
        END IF;
      END $$;
    `,
  }).then(() => {}, () => {});
}

// GET — list all companies
export async function GET() {
  try {
    const supabase = createServiceRole();
    const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
    if (error) {
      if (error.code === "42P01") {
        await ensureTable(supabase);
        return NextResponse.json({ success: true, companies: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, companies: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — create company
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { name, industry, contact_name, contact_email, notes } = body;
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const { data, error } = await supabase.from(TABLE).insert({
      name, industry: industry || "Altele", contact_name: contact_name || null,
      contact_email: contact_email || null, notes: notes || null,
    }).select().single();

    if (error) {
      if (error.code === "42P01") {
        await ensureTable(supabase);
        const retry = await supabase.from(TABLE).insert({
          name, industry: industry || "Altele", contact_name: contact_name || null,
          contact_email: contact_email || null, notes: notes || null,
        }).select().single();
        if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
        return NextResponse.json({ success: true, company: retry.data });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, company: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update company
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { data, error } = await supabase.from(TABLE).update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, company: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — delete company (cascades to campaigns)
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Delete campaigns first (which cascade to evaluations and KPIs)
    await supabase.from("predictive_campaigns").delete().eq("company_id", id);
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
