import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list codes, required ?group_id=xxx
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const groupId = new URL(req.url).searchParams.get("group_id");
    let query = supabase.from("focus_codes").select("*").order("transcript_line_start", { ascending: true });
    if (groupId) query = query.eq("group_id", groupId);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, codes: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — add code
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { group_id, quote_text } = body;
    if (!group_id || !quote_text) return NextResponse.json({ error: "group_id and quote_text required" }, { status: 400 });
    const insertData: Record<string, unknown> = { group_id, quote_text };
    for (const f of ["participant_id", "transcript_line_start", "transcript_line_end", "timestamp_marker",
      "code_coder1", "code_coder1_date", "code_coder2", "code_coder2_date", "code_agreed",
      "agreement_type", "reconciliation_notes", "theme_id", "rifc_dimension", "discussion_module"]) {
      if (body[f] !== undefined) insertData[f] = body[f];
    }
    const { data, error } = await supabase.from("focus_codes").insert(insertData).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, code: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update code
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const { data, error } = await supabase.from("focus_codes").update(fields).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, code: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const { error } = await supabase.from("focus_codes").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
