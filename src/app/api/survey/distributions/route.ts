import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

// GET — list all distributions with completion counts
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

    // Get completion counts per distribution
    const { data: counts } = await supabase
      .from("survey_respondents")
      .select("distribution_id")
      .not("distribution_id", "is", null)
      .not("completed_at", "is", null);

    const countMap: Record<string, number> = {};
    (counts || []).forEach((r: { distribution_id: string }) => {
      countMap[r.distribution_id] = (countMap[r.distribution_id] || 0) + 1;
    });

    // Also get started (not necessarily completed) counts
    const { data: startedCounts } = await supabase
      .from("survey_respondents")
      .select("distribution_id")
      .not("distribution_id", "is", null);

    const startedMap: Record<string, number> = {};
    (startedCounts || []).forEach((r: { distribution_id: string }) => {
      startedMap[r.distribution_id] = (startedMap[r.distribution_id] || 0) + 1;
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
