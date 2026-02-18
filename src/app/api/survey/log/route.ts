import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — list all respondents with their response counts
export async function GET() {
  try {
    const supabase = createServiceRole();

    // Use ONLY columns proven to exist (same as results API)
    const { data: respondents, error: respError } = await supabase
      .from("survey_respondents")
      .select("id, demographics, behavioral, psychographic, device_type, variant_group, completed_at, locale, distribution_id");

    if (respError) {
      return NextResponse.json({ error: respError.message, hint: "respondents query failed" }, { status: 500 });
    }

    // Get response counts per respondent
    const { data: responses } = await supabase
      .from("survey_responses")
      .select("respondent_id, stimulus_id");

    const responseCounts: Record<string, number> = {};
    (responses || []).forEach((r: { respondent_id: string }) => {
      responseCounts[r.respondent_id] = (responseCounts[r.respondent_id] || 0) + 1;
    });

    // Build logs with response count, sort by completed_at (newest first)
    const logs = (respondents || [])
      .map((r) => ({
        ...r,
        responseCount: responseCounts[r.id] || 0,
      }))
      .sort((a, b) => {
        const ta = new Date(a.completed_at || 0).getTime();
        const tb = new Date(b.completed_at || 0).getTime();
        return tb - ta;
      });

    return NextResponse.json({ ok: true, logs, total: logs.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — delete specific respondents and their responses
export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Must provide array of respondent ids" }, { status: 400 });
    }

    const supabase = createServiceRole();

    // 1. Delete responses for these respondents
    const { error: e1 } = await supabase
      .from("survey_responses")
      .delete()
      .in("respondent_id", ids);

    // 2. Delete the respondents themselves
    const { error: e2 } = await supabase
      .from("survey_respondents")
      .delete()
      .in("id", ids);

    const errors = [e1, e2].filter(Boolean);
    if (errors.length > 0) {
      return NextResponse.json({
        ok: false,
        errors: errors.map((e) => e!.message),
      }, { status: 500 });
    }

    return NextResponse.json({ ok: true, deleted: ids.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
