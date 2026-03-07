import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServiceRole();

  // 1. Get all active stimuli
  const { data: stimuli } = await supabase
    .from("survey_stimuli")
    .select("id, name")
    .eq("is_active", true)
    .order("display_order");
  const stimuliMap = new Map((stimuli || []).map(s => [s.id, s.name]));
  const expectedCount = stimuliMap.size;

  // 2. Get all non-archived respondents
  const { data: respondents } = await supabase
    .from("survey_respondents")
    .select("id, completed_at, started_at, demographics, distribution_id, step_completed")
    .eq("is_archived", false)
    .order("completed_at", { ascending: false });

  if (!respondents) return NextResponse.json({ error: "No respondents" });

  // 3. Get all responses (batched)
  const allIds = respondents.map(r => r.id);
  let allResponses: { respondent_id: string; stimulus_id: string }[] = [];
  const BATCH = 15;
  for (let i = 0; i < allIds.length; i += BATCH) {
    const batch = allIds.slice(i, i + BATCH);
    const { data } = await supabase
      .from("survey_responses")
      .select("respondent_id, stimulus_id")
      .in("respondent_id", batch)
      .range(0, 9999);
    if (data) allResponses = allResponses.concat(data);
  }

  // 4. Build distinct stimuli per respondent
  const stimuliByRespondent: Record<string, Set<string>> = {};
  const responseCountByRespondent: Record<string, number> = {};
  for (const r of allResponses) {
    if (!stimuliByRespondent[r.respondent_id]) stimuliByRespondent[r.respondent_id] = new Set();
    stimuliByRespondent[r.respondent_id].add(r.stimulus_id);
    responseCountByRespondent[r.respondent_id] = (responseCountByRespondent[r.respondent_id] || 0) + 1;
  }

  // 5. Find completed respondents with missing stimuli
  const completed = respondents.filter(r => r.completed_at != null);
  const withFullData = completed.filter(r => (stimuliByRespondent[r.id]?.size || 0) >= expectedCount);
  const withPartialData = completed.filter(r => (stimuliByRespondent[r.id]?.size || 0) < expectedCount);

  // 6. Detail for each partial respondent
  const partialDetails = withPartialData.map(r => {
    const answered = stimuliByRespondent[r.id] || new Set();
    const missingIds = Array.from(stimuliMap.keys()).filter(sid => !answered.has(sid));
    const missingNames = missingIds.map(sid => stimuliMap.get(sid) || sid);
    return {
      id: r.id,
      completedAt: r.completed_at,
      startedAt: r.started_at,
      stepCompleted: r.step_completed,
      distributionId: r.distribution_id,
      totalResponses: responseCountByRespondent[r.id] || 0,
      distinctStimuli: answered.size,
      missingCount: missingIds.length,
      missingStimuli: missingNames,
    };
  }).sort((a, b) => b.missingCount - a.missingCount);

  // 7. Distribution of missing counts
  const missingDistribution: Record<number, number> = {};
  for (const p of partialDetails) {
    missingDistribution[p.missingCount] = (missingDistribution[p.missingCount] || 0) + 1;
  }

  // 8. Which stimuli are most commonly missing
  const stimulusMissingCount: Record<string, number> = {};
  for (const p of partialDetails) {
    for (const name of p.missingStimuli) {
      stimulusMissingCount[name] = (stimulusMissingCount[name] || 0) + 1;
    }
  }
  const mostMissed = Object.entries(stimulusMissingCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ stimulus: name, missingFrom: count }));

  return NextResponse.json({
    summary: {
      totalRespondents: respondents.length,
      totalCompleted: completed.length,
      withAllStimuli: withFullData.length,
      withPartialData: withPartialData.length,
      expectedStimuliCount: expectedCount,
      nPerMaterialIfStrict: withFullData.length,
      nPerMaterialIfOR: `~${Math.round(allResponses.filter(r => new Set(completed.map(c => c.id)).has(r.respondent_id)).length / expectedCount)}`,
    },
    missingDistribution,
    mostMissedStimuli: mostMissed.slice(0, 10),
    partialRespondents: partialDetails,
  });
}
