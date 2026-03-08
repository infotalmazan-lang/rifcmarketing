import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list all 4 groups
export async function GET() {
  try {
    const supabase = createServiceRole();
    const { data, error } = await supabase
      .from("focus_groups")
      .select("*")
      .order("group_number");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, groups: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update group fields
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const { data, error } = await supabase
      .from("focus_groups")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, group: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
