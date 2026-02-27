import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list respondents with response counts. ?archived=1 returns archived only.
export async function GET(request: Request) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(request.url);
    const showArchived = searchParams.get("archived") === "1";

    // ── Step 1: Fetch respondent IDs (lightweight — no JSONB, no truncation) ──
    // CRITICAL: PostgREST silently truncates rows when JSONB columns make payload
    // too large. FIX: get IDs first, then fetch full data in small batches.
    let idQuery = supabase.from("survey_respondents")
      .select("id")
      .range(0, 9999);
    if (showArchived) {
      idQuery = idQuery.eq("is_archived", true);
    } else {
      idQuery = idQuery.or("is_archived.eq.false,is_archived.is.null");
    }

    const { data: idData, error: idError } = await idQuery;
    if (idError) {
      return NextResponse.json({ error: idError.message, hint: "respondent ID query failed" }, { status: 500 });
    }
    const allIds = (idData || []).map((r: any) => r.id as string);

    // ── Step 2: Fetch full respondent data in BATCHES to prevent PostgREST truncation ──
    const LOG_BATCH_SIZE = 15;
    let respondents: any[] = [];
    for (let i = 0; i < allIds.length; i += LOG_BATCH_SIZE) {
      const batchIds = allIds.slice(i, i + LOG_BATCH_SIZE);
      const { data: batchData, error: batchError } = await supabase
        .from("survey_respondents")
        .select("id, started_at, completed_at, step_completed, distribution_id, ip_address, ip_hash, browser_fingerprint, user_agent, device_type, locale, is_flagged, flag_reason, is_archived, archived_at, demographics, behavioral, psychographic")
        .in("id", batchIds);
      if (batchError) {
        return NextResponse.json({ error: batchError.message, hint: "respondent batch query failed" }, { status: 500 });
      }
      respondents = respondents.concat(batchData || []);
    }

    // Get full response data per respondent in BATCHES (avoid PostgREST truncation)
    let responses: any[] = [];
    if (allIds.length > 0) {
      const RESP_BATCH = 15;
      for (let i = 0; i < allIds.length; i += RESP_BATCH) {
        const batchIds = allIds.slice(i, i + RESP_BATCH);
        const { data: batchResp } = await supabase
          .from("survey_responses")
          .select("respondent_id, stimulus_id, r_score, i_score, f_score, c_score, cta_score, brand_familiar, time_spent_seconds")
          .in("respondent_id", batchIds);
        responses = responses.concat(batchResp || []);
      }
    }

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
      // Preserve "dup_ok" flag_reason when clearing flag (it means user confirmed OK)
      if (reason === "dup_ok") {
        updateData.is_flagged = false;
        updateData.flag_reason = "dup_ok";
      } else {
        updateData.flag_reason = null;
      }
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
