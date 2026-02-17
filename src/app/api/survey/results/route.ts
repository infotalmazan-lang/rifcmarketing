import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const revalidate = 60; // Cache 1 minute

export async function GET() {
  try {
    const supabase = createServiceRole();

    // Total respondents
    const { count: totalRespondents } = await supabase
      .from("survey_respondents")
      .select("*", { count: "exact", head: true });

    // Completed respondents
    const { count: completedRespondents } = await supabase
      .from("survey_respondents")
      .select("*", { count: "exact", head: true })
      .not("completed_at", "is", null);

    // Total responses
    const { count: totalResponses } = await supabase
      .from("survey_responses")
      .select("*", { count: "exact", head: true });

    // Per-stimulus aggregated results
    const { data: stimuli } = await supabase
      .from("survey_stimuli")
      .select("id, name, type, industry")
      .eq("is_active", true)
      .order("display_order");

    const stimuliResults = [];
    for (const s of stimuli || []) {
      const { data: responses } = await supabase
        .from("survey_responses")
        .select("r_score, i_score, f_score, c_computed")
        .eq("stimulus_id", s.id);

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
