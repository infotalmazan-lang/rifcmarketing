import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(request.url);
    const distributionId = searchParams.get("distribution_id");

    // Build respondent filter
    let respondentQuery = supabase
      .from("survey_respondents")
      .select("id", { count: "exact" });

    if (distributionId) {
      respondentQuery = respondentQuery.eq("distribution_id", distributionId);
    }

    const { data: filteredRespondents, count: totalRespondents } = await respondentQuery;

    // Completed respondents
    let completedQuery = supabase
      .from("survey_respondents")
      .select("id", { count: "exact", head: true })
      .not("completed_at", "is", null);

    if (distributionId) {
      completedQuery = completedQuery.eq("distribution_id", distributionId);
    }

    const { count: completedRespondents } = await completedQuery;

    // Get respondent IDs for filtering responses
    const respondentIds = (filteredRespondents || []).map((r: { id: string }) => r.id);

    // Total responses (filtered)
    let totalResponses = 0;
    if (respondentIds.length > 0) {
      const { count } = await supabase
        .from("survey_responses")
        .select("*", { count: "exact", head: true })
        .in("respondent_id", respondentIds);
      totalResponses = count || 0;
    }

    // Per-stimulus aggregated results
    const { data: stimuli } = await supabase
      .from("survey_stimuli")
      .select("id, name, type, industry")
      .eq("is_active", true)
      .order("display_order");

    const stimuliResults = [];
    for (const s of stimuli || []) {
      let respQuery = supabase
        .from("survey_responses")
        .select("r_score, i_score, f_score, c_computed")
        .eq("stimulus_id", s.id);

      if (respondentIds.length > 0 && distributionId) {
        respQuery = respQuery.in("respondent_id", respondentIds);
      }

      const { data: responses } = await respQuery;

      const n = responses?.length || 0;
      if (n === 0) {
        stimuliResults.push({
          ...s,
          response_count: 0,
          avg_r: 0,
          avg_i: 0,
          avg_f: 0,
          avg_c: 0,
          sd_c: 0,
        });
        continue;
      }

      const sumR = responses!.reduce((a, r) => a + r.r_score, 0);
      const sumI = responses!.reduce((a, r) => a + r.i_score, 0);
      const sumF = responses!.reduce((a, r) => a + r.f_score, 0);
      const sumC = responses!.reduce((a, r) => a + r.c_computed, 0);
      const avgC = sumC / n;
      const variance =
        responses!.reduce((a, r) => a + Math.pow(r.c_computed - avgC, 2), 0) /
        n;

      stimuliResults.push({
        ...s,
        response_count: n,
        avg_r: Math.round((sumR / n) * 100) / 100,
        avg_i: Math.round((sumI / n) * 100) / 100,
        avg_f: Math.round((sumF / n) * 100) / 100,
        avg_c: Math.round(avgC * 100) / 100,
        sd_c: Math.round(Math.sqrt(variance) * 100) / 100,
      });
    }

    // AI evaluations
    const { data: aiEvaluations } = await supabase
      .from("survey_ai_evaluations")
      .select("*")
      .order("evaluated_at", { ascending: false });

    const total = totalRespondents || 0;
    const completed = completedRespondents || 0;

    return NextResponse.json({
      totalRespondents: total,
      completedRespondents: completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalResponses: totalResponses || 0,
      stimuliResults,
      aiEvaluations: aiEvaluations || [],
    });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
