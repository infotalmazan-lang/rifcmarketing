import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list participants, required ?group_id=xxx
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const groupId = new URL(req.url).searchParams.get("group_id");
    let query = supabase.from("focus_participants").select("*").order("created_at");
    if (groupId) query = query.eq("group_id", groupId);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, participants: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — add participant
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { group_id, name, email, phone, profile_short, marketing_experience, notes } = body;
    if (!group_id || !name) return NextResponse.json({ error: "group_id and name required" }, { status: 400 });
    const { data, error } = await supabase
      .from("focus_participants")
      .insert({ group_id, name, email: email || null, phone: phone || null, profile_short: profile_short || null, marketing_experience: marketing_experience || null, notes: notes || null })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, participant: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update participant
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const { data, error } = await supabase.from("focus_participants").update(fields).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, participant: data });
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
    const { error } = await supabase.from("focus_participants").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
