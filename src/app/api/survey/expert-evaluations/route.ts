import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list all expert evaluations, optionally filtered by stimulus_id or expert_id
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const stimulusId = searchParams.get("stimulus_id");
    const expertId = searchParams.get("expert_id");
    const token = searchParams.get("token"); // For public expert page

    let query = supabase
      .from("survey_expert_evaluations")
      .select("*")
      .order("evaluated_at", { ascending: false });

    if (stimulusId) {
      query = query.eq("stimulus_id", stimulusId);
    }

    if (expertId) {
      query = query.eq("expert_id", expertId);
    }

    // Token-based access: find expert by token, then filter by expert_id
    if (token) {
      const { data: expert, error: expertErr } = await supabase
        .from("survey_experts")
        .select("id, is_active")
        .eq("access_token", token)
        .single();

      if (expertErr || !expert) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
      }
      if (!expert.is_active) {
        return NextResponse.json({ error: "Access revoked" }, { status: 403 });
      }
      query = query.eq("expert_id", expert.id);
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

// POST — add expert evaluation (from admin or from public expert page via token)
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const {
      stimulus_id, expert_name, expert_role,
      r_score, i_score, f_score, c_score, cta_score,
      r_justification, i_justification, f_justification,
      c_justification, cta_justification,
      brand_familiar, brand_justification,
      notes, expert_id, token,
    } = body;

    // Token-based auth: resolve expert_id from token
    let resolvedExpertId = expert_id;
    let resolvedExpertName = expert_name;
    if (token) {
      const { data: expert, error: expertErr } = await supabase
        .from("survey_experts")
        .select("id, first_name, last_name, is_active")
        .eq("access_token", token)
        .single();

      if (expertErr || !expert) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
      }
      if (!expert.is_active) {
        return NextResponse.json({ error: "Access revoked" }, { status: 403 });
      }
      resolvedExpertId = expert.id;
      resolvedExpertName = `${expert.first_name} ${expert.last_name}`;
    }

    if (!stimulus_id || r_score == null || i_score == null || f_score == null) {
      return NextResponse.json(
        { error: "Campuri obligatorii: stimulus_id, r_score, i_score, f_score" },
        { status: 400 }
      );
    }

    const clamp = (v: number) => Math.min(10, Math.max(1, Math.round(v)));

    const insertData: Record<string, unknown> = {
      stimulus_id,
      expert_name: resolvedExpertName || "Expert",
      expert_role: expert_role || null,
      r_score: clamp(r_score),
      i_score: clamp(i_score),
      f_score: clamp(f_score),
      r_justification: r_justification || null,
      i_justification: i_justification || null,
      f_justification: f_justification || null,
      notes: notes || null,
    };

    // New fields (may not exist yet, added with migration 020)
    if (resolvedExpertId) insertData.expert_id = resolvedExpertId;
    if (c_score != null) insertData.c_score = clamp(c_score);
    if (cta_score != null) insertData.cta_score = clamp(cta_score);
    if (c_justification !== undefined) insertData.c_justification = c_justification || null;
    if (cta_justification !== undefined) insertData.cta_justification = cta_justification || null;
    if (brand_familiar !== undefined) insertData.brand_familiar = brand_familiar;
    if (brand_justification !== undefined) insertData.brand_justification = brand_justification || null;

    // Upsert: if expert already evaluated this stimulus, update
    if (resolvedExpertId) {
      // Check if evaluation already exists
      const { data: existing } = await supabase
        .from("survey_expert_evaluations")
        .select("id")
        .eq("expert_id", resolvedExpertId)
        .eq("stimulus_id", stimulus_id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("survey_expert_evaluations")
          .update(insertData)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) {
          // Fallback: if new columns don't exist, retry without them
          const fallback = { ...insertData };
          delete fallback.expert_id;
          delete fallback.c_score;
          delete fallback.cta_score;
          delete fallback.c_justification;
          delete fallback.cta_justification;
          delete fallback.brand_familiar;
          delete fallback.brand_justification;
          const retry = await supabase.from("survey_expert_evaluations").update(fallback).eq("id", existing.id).select().single();
          if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
          return NextResponse.json({ success: true, evaluation: retry.data, updated: true });
        }
        return NextResponse.json({ success: true, evaluation: data, updated: true });
      }
    }

    // Insert new
    let { data, error } = await supabase
      .from("survey_expert_evaluations")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // Fallback: if new columns don't exist, retry without them
      const fallback = { ...insertData };
      delete fallback.expert_id;
      delete fallback.c_score;
      delete fallback.cta_score;
      delete fallback.c_justification;
      delete fallback.cta_justification;
      delete fallback.brand_familiar;
      delete fallback.brand_justification;
      const retry = await supabase.from("survey_expert_evaluations").insert(fallback).select().single();
      if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
      return NextResponse.json({ success: true, evaluation: retry.data });
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
    const { id, token, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing evaluation id" }, { status: 400 });
    }

    // Token-based auth: verify expert owns this evaluation
    if (token) {
      const { data: expert } = await supabase
        .from("survey_experts")
        .select("id, is_active")
        .eq("access_token", token)
        .single();

      if (!expert || !expert.is_active) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const { data: evalData } = await supabase
        .from("survey_expert_evaluations")
        .select("expert_id")
        .eq("id", id)
        .single();

      if (!evalData || evalData.expert_id !== expert.id) {
        return NextResponse.json({ error: "Not your evaluation" }, { status: 403 });
      }
    }

    const updates: Record<string, unknown> = {};
    const allowed = [
      "expert_name", "expert_role", "r_score", "i_score", "f_score",
      "c_score", "cta_score",
      "r_justification", "i_justification", "f_justification",
      "c_justification", "cta_justification",
      "brand_familiar", "brand_justification",
      "notes",
    ];
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }

    // Clamp scores
    const clamp = (v: number) => Math.min(10, Math.max(1, Math.round(v)));
    if (updates.r_score != null) updates.r_score = clamp(updates.r_score as number);
    if (updates.i_score != null) updates.i_score = clamp(updates.i_score as number);
    if (updates.f_score != null) updates.f_score = clamp(updates.f_score as number);
    if (updates.c_score != null) updates.c_score = clamp(updates.c_score as number);
    if (updates.cta_score != null) updates.cta_score = clamp(updates.cta_score as number);

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
