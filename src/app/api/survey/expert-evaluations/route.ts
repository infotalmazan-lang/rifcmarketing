import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list all expert evaluations, optionally filtered by stimulus_id
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const stimulusId = searchParams.get("stimulus_id");

    let query = supabase
      .from("survey_expert_evaluations")
      .select("*")
      .order("evaluated_at", { ascending: false });

    if (stimulusId) {
      query = query.eq("stimulus_id", stimulusId);
    }

    const { data, error } = await query;

    if (error) {
      // Table might not exist yet
      if (error.code === "42P01") {
        return NextResponse.json({ success: true, evaluations: [], needsMigration: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, evaluations: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — add expert evaluation
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { stimulus_id, expert_name, expert_role, r_score, i_score, f_score, r_justification, i_justification, f_justification, notes } = body;

    if (!stimulus_id || !expert_name || r_score == null || i_score == null || f_score == null) {
      return NextResponse.json(
        { error: "Campuri obligatorii: stimulus_id, expert_name, r_score, i_score, f_score" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("survey_expert_evaluations")
      .insert({
        stimulus_id,
        expert_name,
        expert_role: expert_role || null,
        r_score: Math.min(10, Math.max(1, Math.round(r_score))),
        i_score: Math.min(10, Math.max(1, Math.round(i_score))),
        f_score: Math.min(10, Math.max(1, Math.round(f_score))),
        r_justification: r_justification || null,
        i_justification: i_justification || null,
        f_justification: f_justification || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, evaluation: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update expert evaluation
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing evaluation id" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    const allowed = ["expert_name", "expert_role", "r_score", "i_score", "f_score", "r_justification", "i_justification", "f_justification", "notes"];
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }

    // Clamp scores
    if (updates.r_score != null) updates.r_score = Math.min(10, Math.max(1, Math.round(updates.r_score as number)));
    if (updates.i_score != null) updates.i_score = Math.min(10, Math.max(1, Math.round(updates.i_score as number)));
    if (updates.f_score != null) updates.f_score = Math.min(10, Math.max(1, Math.round(updates.f_score as number)));

    const { data, error } = await supabase
      .from("survey_expert_evaluations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, evaluation: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — remove expert evaluation
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing evaluation id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("survey_expert_evaluations")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
