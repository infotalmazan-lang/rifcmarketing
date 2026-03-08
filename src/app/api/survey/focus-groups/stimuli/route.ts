import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list stimuli, optional ?group_id=xxx
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const groupId = new URL(req.url).searchParams.get("group_id");
    let query = supabase.from("focus_stimuli_selection").select("*").order("display_order");
    if (groupId) query = query.eq("group_id", groupId);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, stimuli: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — add stimulus selection
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { group_id, stimulus_name, c_category } = body;
    if (!group_id || !stimulus_name || !c_category) return NextResponse.json({ error: "group_id, stimulus_name and c_category required" }, { status: 400 });
    const insertData: Record<string, unknown> = { group_id, stimulus_name, c_category };
    for (const f of ["stimulus_id", "stimulus_image_url", "c_score", "display_order", "spontaneous_preferred", "spontaneous_notes"]) {
      if (body[f] !== undefined) insertData[f] = body[f];
    }
    const { data, error } = await supabase.from("focus_stimuli_selection").insert(insertData).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, stimulus: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const { data, error } = await supabase.from("focus_stimuli_selection").update(fields).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, stimulus: data });
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
    const { error } = await supabase.from("focus_stimuli_selection").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
