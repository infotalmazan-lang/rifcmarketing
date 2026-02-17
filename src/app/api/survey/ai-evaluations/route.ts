import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list AI evaluations, optionally filtered by stimulus_id or model_name
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const stimulusId = searchParams.get("stimulus_id");
    const model = searchParams.get("model");

    let query = supabase
      .from("survey_ai_evaluations")
      .select("*")
      .order("evaluated_at", { ascending: false });

    if (stimulusId) query = query.eq("stimulus_id", stimulusId);
    if (model) query = query.eq("model_name", model);

    const { data, error } = await query;

    if (error) {
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

// POST — add AI evaluation
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { stimulus_id, model_name, r_score, i_score, f_score, justification, prompt_version } = body;

    if (!stimulus_id || !model_name || r_score == null || i_score == null || f_score == null) {
      return NextResponse.json(
        { error: "Campuri obligatorii: stimulus_id, model_name, r_score, i_score, f_score" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("survey_ai_evaluations")
      .insert({
        stimulus_id,
        model_name,
        r_score: Math.min(10, Math.max(1, parseFloat(r_score))),
        i_score: Math.min(10, Math.max(1, parseFloat(i_score))),
        f_score: Math.min(10, Math.max(1, parseFloat(f_score))),
        justification: justification || {},
        prompt_version: prompt_version || "v1",
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

// PUT — update AI evaluation
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing evaluation id" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    const allowed = ["model_name", "r_score", "i_score", "f_score", "justification", "prompt_version"];
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }

    if (updates.r_score != null) updates.r_score = Math.min(10, Math.max(1, parseFloat(updates.r_score as string)));
    if (updates.i_score != null) updates.i_score = Math.min(10, Math.max(1, parseFloat(updates.i_score as string)));
    if (updates.f_score != null) updates.f_score = Math.min(10, Math.max(1, parseFloat(updates.f_score as string)));

    const { data, error } = await supabase
      .from("survey_ai_evaluations")
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

// DELETE — remove AI evaluation
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing evaluation id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("survey_ai_evaluations")
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
