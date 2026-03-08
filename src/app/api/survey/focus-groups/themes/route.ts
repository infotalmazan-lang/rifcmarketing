import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list all themes
export async function GET() {
  try {
    const supabase = createServiceRole();
    const { data, error } = await supabase.from("focus_themes").select("*").order("theme_number");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, themes: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — create theme
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { theme_name } = body;
    if (!theme_name) return NextResponse.json({ error: "theme_name required" }, { status: 400 });
    // Auto-increment theme_number
    const { data: existing } = await supabase.from("focus_themes").select("theme_number").order("theme_number", { ascending: false }).limit(1);
    const nextNum = (existing && existing.length > 0 ? existing[0].theme_number : 0) + 1;
    const insertData: Record<string, unknown> = { theme_number: nextNum, theme_name };
    for (const f of ["theme_description", "rifc_dimension", "present_in_groups", "representative_quote",
      "representative_participant_anonymous_id", "representative_group", "status"]) {
      if (body[f] !== undefined) insertData[f] = body[f];
    }
    const { data, error } = await supabase.from("focus_themes").insert(insertData).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, theme: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update theme
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const { data, error } = await supabase.from("focus_themes").update(fields).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, theme: data });
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
    // Unlink codes from this theme first
    await supabase.from("focus_codes").update({ theme_id: null }).eq("theme_id", id);
    const { error } = await supabase.from("focus_themes").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
