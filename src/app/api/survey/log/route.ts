import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list respondents with response counts. ?archived=1 returns archived only.
export async function GET(request: Request) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(request.url);
    const showArchived = searchParams.get("archived") === "1";

    // Fetch respondents — active or archived
    let query = supabase.from("survey_respondents").select("*");
    if (showArchived) {
      query = query.eq("is_archived", true);
    } else {
      // Show non-archived: is_archived = false OR is_archived IS NULL (for old rows before migration)
      query = query.or("is_archived.eq.false,is_archived.is.null");
    }

    const { data: respondents, error: respError } = await query;

    if (respError) {
      return NextResponse.json({ error: respError.message, hint: "respondents query failed" }, { status: 500 });
    }

    // Get full response data per respondent (scores + stimulus info)
    const { data: responses } = await supabase
      .from("survey_responses")
      .select("respondent_id, stimulus_id, r_score, i_score, f_score, c_score, cta_score, brand_familiar, time_spent_seconds");

    // Also get stimuli names for display
    const { data: stimuliData } = await supabase
      .from("survey_stimuli")
      .select("id, name, type");

    const stimuliMap: Record<string, { name: string; type: string }> = {};
    (stimuliData || []).forEach((s: { id: string; name: string; type: string }) => {
      stimuliMap[s.id] = { name: s.name, type: s.type };
    });

    const responseCounts: Record<string, number> = {};
    const responseDetails: Record<string, any[]> = {};
    (responses || []).forEach((r: any) => {
      responseCounts[r.respondent_id] = (responseCounts[r.respondent_id] || 0) + 1;
      if (!responseDetails[r.respondent_id]) responseDetails[r.respondent_id] = [];
      responseDetails[r.respondent_id].push({
        ...r,
        stimulusName: stimuliMap[r.stimulus_id]?.name || "—",
        stimulusType: stimuliMap[r.stimulus_id]?.type || "—",
      });
    });

    // Fetch distributions to resolve names
    const { data: distData } = await supabase
      .from("survey_distributions")
      .select("id, name, tag");
    const distMap: Record<string, { name: string; tag: string }> = {};
    (distData || []).forEach((d: { id: string; name: string; tag: string }) => {
      distMap[d.id] = { name: d.name, tag: d.tag };
    });

    // Build logs with response count + details, sort by most recent date (newest first)
    const logs = (respondents || [])
      .map((r) => ({
        ...r,
        responseCount: responseCounts[r.id] || 0,
        responses: responseDetails[r.id] || [],
        distribution_name: r.distribution_id ? (distMap[r.distribution_id]?.name || "Link necunoscut") : "General",
        distribution_tag: r.distribution_id ? (distMap[r.distribution_id]?.tag || "") : "",
      }))
      .sort((a, b) => {
        const dateA = a.completed_at || a.started_at || "1970-01-01";
        const dateB = b.completed_at || b.started_at || "1970-01-01";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

    return NextResponse.json({ ok: true, logs, total: logs.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — soft-delete (archive) respondents. Set is_archived=true.
export async function DELETE(request: Request) {
  try {
    const { ids, permanent } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Must provide array of respondent ids" }, { status: 400 });
    }

    const supabase = createServiceRole();

    if (permanent) {
      // PERMANENT delete — remove from database entirely
      const { error: e1 } = await supabase
        .from("survey_responses")
        .delete()
        .in("respondent_id", ids);

      const { error: e2 } = await supabase
        .from("survey_respondents")
        .delete()
        .in("id", ids);

      const errors = [e1, e2].filter(Boolean);
      if (errors.length > 0) {
        return NextResponse.json({ ok: false, errors: errors.map((e) => e!.message) }, { status: 500 });
      }

      return NextResponse.json({ ok: true, deleted: ids.length, permanent: true });
    }

    // SOFT delete — archive
    const { error } = await supabase
      .from("survey_respondents")
      .update({ is_archived: true, archived_at: new Date().toISOString() })
      .in("id", ids);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, archived: ids.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — restore archived respondents (un-archive)
export async function PUT(request: Request) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Must provide array of respondent ids" }, { status: 400 });
    }

    const supabase = createServiceRole();

    const { error } = await supabase
      .from("survey_respondents")
      .update({ is_archived: false, archived_at: null })
      .in("id", ids);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, restored: ids.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — toggle flag on respondents (flag / unflag)
export async function PATCH(request: Request) {
  try {
    const { ids, flagged, reason } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Must provide array of respondent ids" }, { status: 400 });
    }

    const supabase = createServiceRole();

    const updateData: Record<string, unknown> = {
      is_flagged: !!flagged,
    };
    if (flagged && reason) {
      updateData.flag_reason = String(reason).slice(0, 200);
    }
    if (!flagged) {
      updateData.flag_reason = null;
    }

    const { error } = await supabase
      .from("survey_respondents")
      .update(updateData)
      .in("id", ids);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, updated: ids.length, flagged: !!flagged });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
