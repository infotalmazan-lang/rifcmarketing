import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(request.url);
    const distributionId = searchParams.get("distribution_id");

    // Build respondent query — fetch demographics/behavioral/psychographic for breakdowns
    let respondentQuery = supabase
      .from("survey_respondents")
      .select("id, demographics, behavioral, psychographic, device_type, variant_group, completed_at, locale", { count: "exact" });

    if (distributionId) {
      respondentQuery = respondentQuery.eq("distribution_id", distributionId);
    }

    const { data: filteredRespondents, count: totalRespondents } = await respondentQuery;

    // Completed respondents — computed from the same dataset to ensure consistency
    const completedRespondents = (filteredRespondents || []).filter(r => r.completed_at != null).length;

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

    // Per-stimulus aggregated results — ALL active stimuli
    const { data: stimuli } = await supabase
      .from("survey_stimuli")
      .select("id, name, type, industry, variant_label, execution_quality")
      .eq("is_active", true)
      .order("display_order");

    const stimuliResults = [];
    for (const s of stimuli || []) {
      let respQuery = supabase
        .from("survey_responses")
        .select("r_score, i_score, f_score, c_computed, c_score, cta_score, time_spent_seconds")
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
          avg_r: 0, avg_i: 0, avg_f: 0, avg_c: 0, sd_c: 0,
          avg_c_score: 0, avg_cta: 0, avg_time: 0,
        });
        continue;
      }

      const sumR = responses!.reduce((a, r) => a + r.r_score, 0);
      const sumI = responses!.reduce((a, r) => a + r.i_score, 0);
      const sumF = responses!.reduce((a, r) => a + r.f_score, 0);
      const sumC = responses!.reduce((a, r) => a + r.c_computed, 0);
      const avgC = sumC / n;
      const variance = responses!.reduce((a, r) => a + Math.pow(r.c_computed - avgC, 2), 0) / n;

      // c_score and cta_score may be null for older responses
      const cScores = responses!.filter(r => r.c_score != null);
      const ctaScores = responses!.filter(r => r.cta_score != null);
      const timeScores = responses!.filter(r => r.time_spent_seconds != null);

      stimuliResults.push({
        ...s,
        response_count: n,
        avg_r: Math.round((sumR / n) * 100) / 100,
        avg_i: Math.round((sumI / n) * 100) / 100,
        avg_f: Math.round((sumF / n) * 100) / 100,
        avg_c: Math.round(avgC * 100) / 100,
        sd_c: Math.round(Math.sqrt(variance) * 100) / 100,
        avg_c_score: cScores.length > 0 ? Math.round((cScores.reduce((a, r) => a + r.c_score, 0) / cScores.length) * 100) / 100 : 0,
        avg_cta: ctaScores.length > 0 ? Math.round((ctaScores.reduce((a, r) => a + r.cta_score, 0) / ctaScores.length) * 100) / 100 : 0,
        avg_time: timeScores.length > 0 ? Math.round(timeScores.reduce((a, r) => a + r.time_spent_seconds, 0) / timeScores.length) : 0,
      });
    }

    // AI evaluations
    const { data: aiEvaluations } = await supabase
      .from("survey_ai_evaluations")
      .select("*")
      .order("evaluated_at", { ascending: false });

    // Demographic breakdowns from respondents
    const respondents = filteredRespondents || [];
    const demographics: Record<string, Record<string, number>> = {
      gender: {}, ageRange: {}, country: {}, locationType: {}, incomeRange: {}, education: {},
    };
    const behavioralData: Record<string, Record<string, number>> = {
      purchaseFrequency: {}, preferredChannels: {}, dailyOnlineTime: {}, primaryDevice: {},
    };
    const psychArrays: Record<string, number[]> = {
      adReceptivity: [], visualPreference: [], impulseBuying: [], irrelevanceAnnoyance: [], attentionCapture: [],
    };

    const globalLocaleCounts: Record<string, number> = {};
    for (const r of respondents) {
      const d = r.demographics as Record<string, string> | null;
      const b = r.behavioral as Record<string, unknown> | null;
      const p = r.psychographic as Record<string, number> | null;
      const loc = ((r as any).locale as string) || "ro";
      globalLocaleCounts[loc.toUpperCase()] = (globalLocaleCounts[loc.toUpperCase()] || 0) + 1;

      if (d) {
        for (const key of Object.keys(demographics)) {
          const val = d[key];
          if (val) demographics[key][val] = (demographics[key][val] || 0) + 1;
        }
      }
      if (b) {
        for (const key of ["purchaseFrequency", "dailyOnlineTime", "primaryDevice"]) {
          const val = b[key] as string;
          if (val) behavioralData[key][val] = (behavioralData[key][val] || 0) + 1;
        }
        const channels = b.preferredChannels as string[];
        if (Array.isArray(channels)) {
          for (const ch of channels) {
            behavioralData.preferredChannels[ch] = (behavioralData.preferredChannels[ch] || 0) + 1;
          }
        }
      }
      if (p) {
        for (const key of Object.keys(psychArrays)) {
          const val = p[key];
          if (typeof val === "number") psychArrays[key].push(val);
        }
      }
    }

    // Psychographic averages
    const psychographicAvg: Record<string, number> = {};
    for (const [key, arr] of Object.entries(psychArrays)) {
      psychographicAvg[key] = arr.length > 0 ? Math.round((arr.reduce((a, v) => a + v, 0) / arr.length) * 100) / 100 : 0;
    }

    // ── Helper: compute breakdowns from a list of respondent records ──
    const computeBreakdowns = (resps: typeof respondents) => {
      const demo: Record<string, Record<string, number>> = {
        gender: {}, ageRange: {}, country: {}, locationType: {}, incomeRange: {}, education: {},
      };
      const behav: Record<string, Record<string, number>> = {
        purchaseFrequency: {}, preferredChannels: {}, dailyOnlineTime: {}, primaryDevice: {},
      };
      const psychArrs: Record<string, number[]> = {
        adReceptivity: [], visualPreference: [], impulseBuying: [], irrelevanceAnnoyance: [], attentionCapture: [],
      };
      const localeCounts: Record<string, number> = {};

      for (const r of resps) {
        const d = r.demographics as Record<string, string> | null;
        const b = r.behavioral as Record<string, unknown> | null;
        const p = r.psychographic as Record<string, number> | null;
        const loc = ((r as any).locale as string) || "ro";
        localeCounts[loc.toUpperCase()] = (localeCounts[loc.toUpperCase()] || 0) + 1;

        if (d) {
          for (const key of Object.keys(demo)) {
            const val = d[key];
            if (val) demo[key][val] = (demo[key][val] || 0) + 1;
          }
        }
        if (b) {
          for (const key of ["purchaseFrequency", "dailyOnlineTime", "primaryDevice"]) {
            const val = b[key] as string;
            if (val) behav[key][val] = (behav[key][val] || 0) + 1;
          }
          const channels = b.preferredChannels as string[];
          if (Array.isArray(channels)) {
            for (const ch of channels) {
              behav.preferredChannels[ch] = (behav.preferredChannels[ch] || 0) + 1;
            }
          }
        }
        if (p) {
          for (const key of Object.keys(psychArrs)) {
            const val = p[key];
            if (typeof val === "number") psychArrs[key].push(val);
          }
        }
      }

      const psychAvg: Record<string, number> = {};
      for (const [key, arr] of Object.entries(psychArrs)) {
        psychAvg[key] = arr.length > 0 ? Math.round((arr.reduce((a, v) => a + v, 0) / arr.length) * 100) / 100 : 0;
      }

      const completedCount = resps.filter(r => r.completed_at != null).length;

      return {
        demographics: demo,
        behavioral: behav,
        psychographicAvg: psychAvg,
        localeCounts,
        respondentCount: resps.length,
        completedCount,
        completionRate: resps.length > 0 ? Math.round((completedCount / resps.length) * 100) : 0,
      };
    }

    // ── Fetch ALL responses with respondent_id + stimulus_id for breakdowns ──
    const { data: allResponses } = await supabase
      .from("survey_responses")
      .select("respondent_id, stimulus_id");

    // Build map: stimulus_id → Set of respondent_ids
    const stimulusRespondentMap: Record<string, Set<string>> = {};
    for (const resp of allResponses || []) {
      if (!stimulusRespondentMap[resp.stimulus_id]) stimulusRespondentMap[resp.stimulus_id] = new Set();
      stimulusRespondentMap[resp.stimulus_id].add(resp.respondent_id);
    }

    // Build respondent lookup map for fast access
    const respondentMap = new Map(respondents.map(r => [r.id, r]));

    // Helper: get respondent records for a set of respondent IDs
    const getRespondentsForIds = (rIds: Set<string>) => {
      const filtered: typeof respondents = [];
      rIds.forEach(id => {
        if (distributionId && !respondentIds.includes(id)) return;
        const r = respondentMap.get(id);
        if (r) filtered.push(r);
      });
      return filtered;
    }

    // ── Per-stimulus breakdowns ──
    const perStimulusBreakdowns: Record<string, ReturnType<typeof computeBreakdowns>> = {};
    for (const s of stimuli || []) {
      const rIds = stimulusRespondentMap[s.id];
      if (!rIds || rIds.size === 0) continue;
      const stimRespondents = getRespondentsForIds(rIds);
      if (stimRespondents.length > 0) {
        perStimulusBreakdowns[s.id] = computeBreakdowns(stimRespondents);
      }
    }

    // ── Per-category breakdowns ──
    // Group stimuli by type
    const stimuliByType: Record<string, string[]> = {};
    for (const s of stimuli || []) {
      if (!stimuliByType[s.type]) stimuliByType[s.type] = [];
      stimuliByType[s.type].push(s.id);
    }

    const perCategoryBreakdowns: Record<string, ReturnType<typeof computeBreakdowns> & { responseCount: number }> = {};
    for (const [catType, stimulusIds] of Object.entries(stimuliByType)) {
      // Merge respondent sets from all stimuli in this category
      const mergedIds = new Set<string>();
      let catResponseCount = 0;
      for (const sid of stimulusIds) {
        const rIds = stimulusRespondentMap[sid];
        if (rIds) {
          rIds.forEach(id => mergedIds.add(id));
          catResponseCount += rIds.size;
        }
      }
      const catRespondents = getRespondentsForIds(mergedIds);
      perCategoryBreakdowns[catType] = {
        ...computeBreakdowns(catRespondents),
        responseCount: catResponseCount,
      };
    }

    const total = totalRespondents || 0;
    const completed = completedRespondents || 0;

    return NextResponse.json({
      totalRespondents: total,
      completedRespondents: completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalResponses: totalResponses || 0,
      stimuliResults,
      aiEvaluations: aiEvaluations || [],
      demographics,
      behavioral: behavioralData,
      psychographicAvg,
      localeCounts: globalLocaleCounts,
      perCategoryBreakdowns,
      perStimulusBreakdowns,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
