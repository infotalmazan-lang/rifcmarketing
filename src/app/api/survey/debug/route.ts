import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServiceRole();

  // 1. All respondents (raw)
  const { data: respondents, error: e1 } = await supabase
    .from("survey_respondents")
    .select("*");

  // 2. All responses (raw)
  const { data: responses, error: e2 } = await supabase
    .from("survey_responses")
    .select("*");

  // 3. All active stimuli
  const { data: stimuli, error: e3 } = await supabase
    .from("survey_stimuli")
    .select("id, name, type, is_active")
    .eq("is_active", true)
    .order("display_order");

  // 4. Check: which stimulus_ids in responses exist in stimuli?
  const stimuliIds = new Set((stimuli || []).map(s => s.id));
  const responseStimIds = Array.from(new Set((responses || []).map(r => r.stimulus_id)));
  const orphanStimIds = responseStimIds.filter(id => !stimuliIds.has(id));

  // 5. Check: which respondent_ids in responses exist in respondents?
  const respondentIds = new Set((respondents || []).map(r => r.id));
  const responseRespIds = Array.from(new Set((responses || []).map(r => r.respondent_id)));
  const orphanRespIds = responseRespIds.filter(id => !respondentIds.has(id));

  return NextResponse.json({
    respondents: {
      count: respondents?.length || 0,
      error: e1?.message || null,
      data: respondents,
    },
    responses: {
      count: responses?.length || 0,
      error: e2?.message || null,
      data: responses,
    },
    stimuli: {
      count: stimuli?.length || 0,
      error: e3?.message || null,
      ids: stimuli?.map(s => ({ id: s.id, name: s.name, type: s.type })),
    },
    diagnostics: {
      uniqueStimIdsInResponses: responseStimIds.length,
      orphanStimulusIds: orphanStimIds,
      orphanRespondentIds: orphanRespIds,
      stimuliIdsMatch: orphanStimIds.length === 0,
      respondentIdsMatch: orphanRespIds.length === 0,
    },
  });
}
