import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

// GET — list all distributions with completion counts
// Uses SAME logic as Results API: excludes archived, uses isEffectivelyCompleted
export async function GET() {
  try {
    const supabase = createServiceRole();

    const { data: distributions, error } = await supabase
      .from("survey_distributions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Table might not exist yet — return empty list gracefully
      if (error.code === "42P01") {
        return NextResponse.json({ success: true, distributions: [], needsMigration: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch non-archived respondents with a distribution_id — SAME filter as LOG & Results APIs
    const { data: respondents } = await supabase
      .from("survey_respondents")
      .select("id, distribution_id, completed_at")
      .not("distribution_id", "is", null)
      .or("is_archived.eq.false,is_archived.is.null")
      .range(0, 9999);

    // Fetch active stimuli count (for isEffectivelyCompleted detection)
    const { data: activeStimuli } = await supabase
      .from("survey_stimuli")
      .select("id")
      .eq("is_active", true);
    const expectedResponseCount = (activeStimuli || []).length;

    // Fetch response counts per respondent (for isEffectivelyCompleted detection)
    const { data: responses } = await supabase
      .from("survey_responses")
      .select("respondent_id")
      .range(0, 99999);

    const respCountByRespondent: Record<string, number> = {};
    (responses || []).forEach((r: { respondent_id: string }) => {
      respCountByRespondent[r.respondent_id] = (respCountByRespondent[r.respondent_id] || 0) + 1;
    });

    // isEffectivelyCompleted — SAME logic as Results API
    const isEffectivelyCompleted = (r: { id: string; completed_at: string | null }) =>
      r.completed_at != null ||
      (expectedResponseCount > 0 && (respCountByRespondent[r.id] || 0) >= expectedResponseCount);

    // Count completions and started per distribution
    const countMap: Record<string, number> = {};
    const startedMap: Record<string, number> = {};
    (respondents || []).forEach((r: { id: string; distribution_id: string; completed_at: string | null }) => {
      startedMap[r.distribution_id] = (startedMap[r.distribution_id] || 0) + 1;
      if (isEffectivelyCompleted(r)) {
        countMap[r.distribution_id] = (countMap[r.distribution_id] || 0) + 1;
      }
    });

    const enriched = (distributions || []).map((d: Record<string, unknown>) => ({
      ...d,
      completions: countMap[d.id as string] || 0,
      started: startedMap[d.id as string] || 0,
    }));

    return NextResponse.json({ success: true, distributions: enriched });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — create a new distribution link
export async function POST(request: Request) {
  try {
    const supabase = createServiceRole();
    const body = await request.json();
    const { name, description, tag, estimated_completions } = body;

    if (!name || !tag) {
      return NextResponse.json(
        { error: "Numele si tag-ul sunt obligatorii" },
        { status: 400 }
      );
    }

    // Sanitize tag: lowercase, alphanumeric + hyphens only
    const cleanTag = tag
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanTag) {
      return NextResponse.json(
        { error: "Tag-ul trebuie sa contina caractere valide" },
        { status: 400 }
      );
    }

    // Check uniqueness
    const { data: existing } = await supabase
      .from("survey_distributions")
      .select("id")
      .eq("tag", cleanTag)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Acest tag exista deja. Alege altul." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("survey_distributions")
      .insert({
        name,
        description: description || "",
        tag: cleanTag,
        estimated_completions: estimated_completions || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, distribution: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH — edit an existing distribution (name, description, estimated_completions — tag is LOCKED)
export async function PATCH(request: Request) {
  try {
    const supabase = createServiceRole();
    const body = await request.json();
    const { id, name, description, estimated_completions } = body;

    if (!id) {
      return NextResponse.json({ error: "ID obligatoriu" }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Numele este obligatoriu" }, { status: 400 });
    }

    const { error } = await supabase
      .from("survey_distributions")
      .update({
        name: name.trim(),
        description: (description || "").trim(),
        estimated_completions: parseInt(estimated_completions) || 0,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — remove a distribution link
export async function DELETE(request: Request) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obligatoriu" }, { status: 400 });
    }

    // Clear distribution_id from respondents first
    await supabase
      .from("survey_respondents")
      .update({ distribution_id: null })
      .eq("distribution_id", id);

    const { error } = await supabase
      .from("survey_distributions")
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
