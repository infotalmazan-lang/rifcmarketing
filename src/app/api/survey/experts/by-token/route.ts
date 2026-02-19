import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/survey/experts/by-token?token=xxx
// Public endpoint: returns expert info + active stimuli + existing evaluations
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // 1. Find expert by token (include professional fields, with fallback if columns missing)
    let expert: Record<string, unknown> | null = null;
    let expertErr: unknown = null;

    // Try with professional fields first
    const { data: expertFull, error: errFull } = await supabase
      .from("survey_experts")
      .select("id, first_name, last_name, email, is_active, created_at, experience_years, brands_worked, total_budget_managed, marketing_roles")
      .eq("access_token", token)
      .single();

    if (!errFull && expertFull) {
      expert = expertFull;
    } else {
      // Fallback: columns may not exist yet (migration 021 not run)
      const { data: expertBasic, error: errBasic } = await supabase
        .from("survey_experts")
        .select("id, first_name, last_name, email, is_active, created_at")
        .eq("access_token", token)
        .single();
      expert = expertBasic;
      expertErr = errBasic;
    }

    if (expertErr || !expert) {
      return NextResponse.json({ error: "Link invalid sau expirat" }, { status: 404 });
    }

    if (!expert.is_active) {
      return NextResponse.json({ error: "Accesul a fost revocat de administrator" }, { status: 403 });
    }

    // 2. Get active stimuli
    const { data: stimuli } = await supabase
      .from("survey_stimuli")
      .select("id, name, type, industry, description, image_url, video_url, audio_url, text_content, pdf_url, site_url")
      .eq("is_active", true)
      .order("display_order");

    // 3. Get expert's existing evaluations
    const { data: evaluations } = await supabase
      .from("survey_expert_evaluations")
      .select("*")
      .eq("expert_id", expert.id)
      .order("evaluated_at", { ascending: false });

    return NextResponse.json({
      success: true,
      expert: {
        id: expert.id,
        first_name: expert.first_name,
        last_name: expert.last_name,
        email: expert.email,
        experience_years: expert.experience_years ?? null,
        brands_worked: expert.brands_worked ?? null,
        total_budget_managed: expert.total_budget_managed ?? null,
        marketing_roles: expert.marketing_roles ?? null,
      },
      stimuli: stimuli || [],
      evaluations: evaluations || [],
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT /api/survey/experts/by-token — Expert self-updates their profile
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { token, experience_years, brands_worked, total_budget_managed, marketing_roles } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Verify expert by token
    const { data: expert, error: expertErr } = await supabase
      .from("survey_experts")
      .select("id, is_active")
      .eq("access_token", token)
      .single();

    if (expertErr || !expert) {
      return NextResponse.json({ error: "Link invalid sau expirat" }, { status: 404 });
    }

    if (!expert.is_active) {
      return NextResponse.json({ error: "Accesul a fost revocat" }, { status: 403 });
    }

    // Build updates — only professional fields allowed for self-edit
    const updates: Record<string, unknown> = {};
    if (experience_years !== undefined) updates.experience_years = experience_years;
    if (brands_worked !== undefined) updates.brands_worked = brands_worked;
    if (total_budget_managed !== undefined) updates.total_budget_managed = total_budget_managed;
    if (marketing_roles !== undefined) updates.marketing_roles = marketing_roles;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Niciun camp de actualizat" }, { status: 400 });
    }

    let { data, error } = await supabase
      .from("survey_experts")
      .update(updates)
      .eq("id", expert.id)
      .select("id, first_name, last_name, email, experience_years, brands_worked, total_budget_managed, marketing_roles")
      .single();

    // If columns don't exist yet, auto-migrate and retry
    if (error && (error.message.includes("column") || error.code === "42703")) {
      await supabase.rpc("exec_sql", {
        sql_text: `ALTER TABLE public.survey_experts
          ADD COLUMN IF NOT EXISTS experience_years smallint,
          ADD COLUMN IF NOT EXISTS brands_worked text[] DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS total_budget_managed numeric,
          ADD COLUMN IF NOT EXISTS marketing_roles text[] DEFAULT '{}';`
      });
      // Retry update after migration
      const retry = await supabase
        .from("survey_experts")
        .update(updates)
        .eq("id", expert.id)
        .select("id, first_name, last_name, email, experience_years, brands_worked, total_budget_managed, marketing_roles")
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, expert: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
