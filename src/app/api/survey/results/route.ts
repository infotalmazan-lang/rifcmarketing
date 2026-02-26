import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(request.url);
    const distributionId = searchParams.get("distribution_id");
    const monthParam = searchParams.get("month"); // "all" | "current" | "YYYY-MM"

    // ── Step 1: Fetch respondents — IDENTICAL to LOG API ──
    // Uses select("*") WITHOUT { count: "exact" } to match LOG exactly.
    // Previously used { count: "exact" } which returned different counts than LOG.
    let respondentQuery = supabase
      .from("survey_respondents")
      .select("*")
      .or("is_archived.eq.false,is_archived.is.null");

    if (distributionId === "__none__") {
      respondentQuery = respondentQuery.is("distribution_id", null);
    } else if (distributionId) {
      respondentQuery = respondentQuery.eq("distribution_id", distributionId);
    }

    const { data: respondentData } = await respondentQuery;
    const respondents = respondentData || [];
    const respondentIds = respondents.map((r: any) => r.id);
    const totalRespondents = respondents.length;

    // ── Step 2: Fetch ALL responses — SAME approach as LOG API (proven reliable) ──
    // Single query, no pagination, no .in() filter. Filter by respondent IDs in JS.
    const { data: allResponseData } = await supabase
      .from("survey_responses")
      .select("respondent_id, stimulus_id, r_score, i_score, f_score, c_computed, c_score, cta_score, time_spent_seconds, brand_familiar, created_at");

    const respondentIdSet = new Set(respondentIds);
    let allFilteredResponses = (allResponseData || []).filter((r: any) => respondentIdSet.has(r.respondent_id));

    // Optional month filter: filter responses by created_at month
    if (monthParam && monthParam !== "all") {
      const targetMonth = monthParam === "current"
        ? new Date().toISOString().slice(0, 7)
        : monthParam; // expects "YYYY-MM"
      allFilteredResponses = allFilteredResponses.filter(
        r => r.created_at && (r.created_at as string).slice(0, 7) === targetMonth
      );
    }

    const totalResponses = allFilteredResponses.length;

    // Build response count per respondent (needed for completion detection)
    const respCountByRespondent: Record<string, number> = {};
    for (const resp of allFilteredResponses) {
      respCountByRespondent[resp.respondent_id] = (respCountByRespondent[resp.respondent_id] || 0) + 1;
    }

    // Fetch stimuli count early (for completion detection)
    const { data: stimuli } = await supabase
      .from("survey_stimuli")
      .select("id, name, type, industry, variant_label, execution_quality")
      .eq("is_active", true)
      .order("display_order");
    const expectedResponseCount = (stimuli || []).length;

    // A respondent is "completed" if completed_at is set OR if they evaluated all active stimuli.
    // This handles legacy respondents from older wizard versions that didn't set completed_at.
    const isEffectivelyCompleted = (r: any) =>
      r.completed_at != null ||
      (expectedResponseCount > 0 && (respCountByRespondent[r.id] || 0) >= expectedResponseCount);

    // Auto-repair: set completed_at for respondents who have all responses but missing completed_at
    // (one-time data fix for legacy wizard entries)
    const needsRepair = respondents.filter(r =>
      r.completed_at == null &&
      expectedResponseCount > 0 &&
      (respCountByRespondent[r.id] || 0) >= expectedResponseCount
    );
    if (needsRepair.length > 0) {
      // Find latest response created_at per respondent to use as completed_at
      const latestResponseTime: Record<string, string> = {};
      for (const resp of allFilteredResponses) {
        if (resp.created_at && needsRepair.some(r => r.id === resp.respondent_id)) {
          if (!latestResponseTime[resp.respondent_id] || resp.created_at > latestResponseTime[resp.respondent_id]) {
            latestResponseTime[resp.respondent_id] = resp.created_at;
          }
        }
      }
      // Repair each respondent (fire-and-forget, don't block response)
      for (const r of needsRepair) {
        const completedAt = latestResponseTime[r.id] || new Date().toISOString();
        supabase.from("survey_respondents").update({ completed_at: completedAt }).eq("id", r.id).then(() => {});
        // Update local data so this response reflects the repair
        r.completed_at = completedAt;
      }
    }

    const completedRespondents = respondents.filter(isEffectivelyCompleted).length;

    // Today / this month / avg session time
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);
    const completedToday = respondents.filter(r => isEffectivelyCompleted(r) && r.completed_at && (r.completed_at as string).slice(0, 10) === todayStr).length;
    const completedMonth = respondents.filter(r => isEffectivelyCompleted(r) && r.completed_at && (r.completed_at as string).slice(0, 7) === monthStr).length;

    // Avg session duration (completed_at - started_at)
    const durations = respondents
      .filter(r => isEffectivelyCompleted(r) && r.completed_at && r.started_at)
      .map(r => Math.round((new Date(r.completed_at as string).getTime() - new Date(r.started_at as string).getTime()) / 1000))
      .filter(s => s > 0 && s < 7200); // ignore outliers > 2h
    const avgSessionTime = durations.length > 0 ? Math.round(durations.reduce((a, v) => a + v, 0) / durations.length) : 0;

    // Build map: stimulus_id → responses[] (from filtered respondents only)
    const responsesByStimulus: Record<string, typeof allFilteredResponses> = {};
    for (const resp of allFilteredResponses) {
      if (!responsesByStimulus[resp.stimulus_id]) responsesByStimulus[resp.stimulus_id] = [];
      responsesByStimulus[resp.stimulus_id].push(resp);
    }

    // Per-stimulus aggregated results (stimuli already fetched above)
    const stimuliResults = [];
    for (const s of stimuli || []) {
      const responses = responsesByStimulus[s.id] || [];
      const n = responses.length;

      if (n === 0) {
        stimuliResults.push({
          ...s,
          response_count: 0,
          avg_r: 0, avg_i: 0, avg_f: 0, avg_c: 0, sd_c: 0,
          avg_c_score: 0, avg_cta: 0, avg_time: 0,
          brand_yes: 0, brand_no: 0, brand_rate: 0,
        });
        continue;
      }

      const sumR = responses.reduce((a: number, r: any) => a + (r.r_score || 0), 0);
      const sumI = responses.reduce((a: number, r: any) => a + (r.i_score || 0), 0);
      const sumF = responses.reduce((a: number, r: any) => a + (r.f_score || 0), 0);
      const sumC = responses.reduce((a: number, r: any) => a + (r.c_computed || 0), 0);
      const avgC = sumC / n;
      const variance = responses.reduce((a: number, r: any) => a + Math.pow((r.c_computed || 0) - avgC, 2), 0) / n;

      // c_score and cta_score may be null for older responses
      const cScores = responses.filter((r: any) => r.c_score != null);
      const ctaScores = responses.filter((r: any) => r.cta_score != null);
      const timeScores = responses.filter((r: any) => r.time_spent_seconds != null);

      // Brand familiarity (awareness) calculation
      const brandResponses = responses.filter((r: any) => r.brand_familiar != null);
      const brandYes = brandResponses.filter((r: any) => r.brand_familiar === true).length;
      const brandNo = brandResponses.filter((r: any) => r.brand_familiar === false).length;
      const brandRate = brandResponses.length > 0 ? Math.round((brandYes / brandResponses.length) * 100) : 0;

      stimuliResults.push({
        ...s,
        response_count: n,
        avg_r: Math.round((sumR / n) * 100) / 100,
        avg_i: Math.round((sumI / n) * 100) / 100,
        avg_f: Math.round((sumF / n) * 100) / 100,
        avg_c: Math.round(avgC * 100) / 100,
        sd_c: Math.round(Math.sqrt(variance) * 100) / 100,
        avg_c_score: cScores.length > 0 ? Math.round((cScores.reduce((a: number, r: any) => a + r.c_score, 0) / cScores.length) * 100) / 100 : 0,
        avg_cta: ctaScores.length > 0 ? Math.round((ctaScores.reduce((a: number, r: any) => a + r.cta_score, 0) / ctaScores.length) * 100) / 100 : 0,
        avg_time: timeScores.length > 0 ? Math.round(timeScores.reduce((a: number, r: any) => a + r.time_spent_seconds, 0) / timeScores.length) : 0,
        brand_yes: brandYes,
        brand_no: brandNo,
        brand_rate: brandRate,
      });
    }

    // AI evaluations
    const { data: aiEvaluations } = await supabase
      .from("survey_ai_evaluations")
      .select("*")
      .order("evaluated_at", { ascending: false });

    // Demographic breakdowns from respondents
    const demographics: Record<string, Record<string, number>> = {
      gender: {}, ageRange: {}, country: {}, locationType: {}, incomeRange: {}, education: {},
    };
    const behavioralData: Record<string, Record<string, number>> = {
      purchaseFrequency: {}, preferredChannels: {}, dailyOnlineTime: {}, primaryDevice: {},
    };
    const psychArrays: Record<string, number[]> = {
      adReceptivity: [], visualPreference: [], marketingExpertise: [], irrelevanceAnnoyance: [], attentionCapture: [], irrelevanceTolerance: [],
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
        adReceptivity: [], visualPreference: [], marketingExpertise: [], irrelevanceAnnoyance: [], attentionCapture: [], irrelevanceTolerance: [],
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

      const completedCount = resps.filter(isEffectivelyCompleted).length;

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

    // Build map: stimulus_id → Set of respondent_ids (from filtered responses)
    const stimulusRespondentMap: Record<string, Set<string>> = {};
    for (const resp of allFilteredResponses) {
      if (!stimulusRespondentMap[resp.stimulus_id]) stimulusRespondentMap[resp.stimulus_id] = new Set();
      stimulusRespondentMap[resp.stimulus_id].add(resp.respondent_id);
    }

    // Build respondent lookup map for fast access
    const respondentMap = new Map(respondents.map(r => [r.id, r]));

    // Helper: get respondent records for a set of respondent IDs
    const getRespondentsForIds = (rIds: Set<string>) => {
      const filtered: typeof respondents = [];
      rIds.forEach(id => {
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
    const stimuliByType: Record<string, string[]> = {};
    for (const s of stimuli || []) {
      if (!stimuliByType[s.type]) stimuliByType[s.type] = [];
      stimuliByType[s.type].push(s.id);
    }

    const perCategoryBreakdowns: Record<string, ReturnType<typeof computeBreakdowns> & { responseCount: number }> = {};
    for (const [catType, stimulusIds] of Object.entries(stimuliByType)) {
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

    // ── Per-distribution summary (only in global/unfiltered mode) ──
    let distributionSummary: { id: string; name: string; tag: string; total: number; completed: number }[] = [];
    if (!distributionId) {
      const { data: dists } = await supabase
        .from("survey_distributions")
        .select("id, name, tag")
        .order("created_at");
      if (dists && dists.length > 0) {
        const distMap: Record<string, { total: number; completed: number }> = {};
        let noDistTotal = 0;
        let noDistCompleted = 0;
        for (const r of respondents) {
          const did = (r as any).distribution_id;
          if (did) {
            if (!distMap[did]) distMap[did] = { total: 0, completed: 0 };
            distMap[did].total++;
            if (isEffectivelyCompleted(r)) distMap[did].completed++;
          } else {
            noDistTotal++;
            if (isEffectivelyCompleted(r)) noDistCompleted++;
          }
        }
        distributionSummary = dists.map(d => ({
          id: d.id,
          name: d.name,
          tag: d.tag,
          total: distMap[d.id]?.total || 0,
          completed: distMap[d.id]?.completed || 0,
        }));
        // Add "fara distributie" if there are respondents without a distribution
        if (noDistTotal > 0) {
          distributionSummary.unshift({ id: "__none__", name: "Fara link", tag: "", total: noDistTotal, completed: noDistCompleted });
        }
      }
    }

    // ── Fatigue / Time Decay Analysis ──────────────────────
    // Groups each respondent's responses by chronological order (created_at),
    // then compares first-third vs last-third to detect cognitive fatigue.
    const fatigueAnalysis = (() => {
      // Build per-respondent ordered responses (need created_at for ordering)
      const byRespondent: Record<string, any[]> = {};
      for (const resp of allFilteredResponses) {
        if (!byRespondent[resp.respondent_id]) byRespondent[resp.respondent_id] = [];
        byRespondent[resp.respondent_id].push(resp);
      }

      // Only use completed respondents with enough responses
      const completedIds = new Set(
        respondents.filter(isEffectivelyCompleted).map(r => r.id)
      );

      // Collect per-position scores (position = index within respondent's sequence)
      const positionData: Record<number, { r: number[]; i: number[]; f: number[]; c: number[]; cta: number[]; time: number[] }> = {};

      for (const [rId, resps] of Object.entries(byRespondent)) {
        if (!completedIds.has(rId)) continue;
        if (resps.length < 6) continue; // need meaningful sequence

        // Sort by created_at to get evaluation order
        resps.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        for (let pos = 0; pos < resps.length; pos++) {
          const r = resps[pos];
          if (!positionData[pos]) positionData[pos] = { r: [], i: [], f: [], c: [], cta: [], time: [] };
          if (r.r_score) positionData[pos].r.push(r.r_score);
          if (r.i_score) positionData[pos].i.push(r.i_score);
          if (r.f_score) positionData[pos].f.push(r.f_score);
          if (r.c_score != null) positionData[pos].c.push(r.c_score);
          if (r.cta_score != null) positionData[pos].cta.push(r.cta_score);
          if (r.time_spent_seconds != null && r.time_spent_seconds > 0) positionData[pos].time.push(r.time_spent_seconds);
        }
      }

      const maxPos = Math.max(...Object.keys(positionData).map(Number), 0);
      const avg = (arr: number[]) => arr.length > 0 ? Math.round((arr.reduce((a, v) => a + v, 0) / arr.length) * 100) / 100 : 0;

      // Per-position averages (for chart)
      const perPosition: { position: number; n: number; avg_r: number; avg_i: number; avg_f: number; avg_c: number; avg_cta: number; avg_time: number }[] = [];
      for (let pos = 0; pos <= maxPos; pos++) {
        const pd = positionData[pos];
        if (!pd) continue;
        perPosition.push({
          position: pos + 1, // 1-indexed for display
          n: pd.r.length,
          avg_r: avg(pd.r),
          avg_i: avg(pd.i),
          avg_f: avg(pd.f),
          avg_c: avg(pd.c),
          avg_cta: avg(pd.cta),
          avg_time: avg(pd.time),
        });
      }

      // First third vs last third comparison
      const thirdSize = Math.max(1, Math.floor(maxPos / 3));
      const firstThirdPositions = perPosition.filter(p => p.position <= thirdSize);
      const lastThirdPositions = perPosition.filter(p => p.position > maxPos - thirdSize);

      const avgGroup = (group: typeof perPosition, key: "avg_r" | "avg_i" | "avg_f" | "avg_c" | "avg_cta" | "avg_time") =>
        group.length > 0 ? Math.round((group.reduce((a, p) => a + p[key], 0) / group.length) * 100) / 100 : 0;

      const firstThird = {
        avg_r: avgGroup(firstThirdPositions, "avg_r"),
        avg_i: avgGroup(firstThirdPositions, "avg_i"),
        avg_f: avgGroup(firstThirdPositions, "avg_f"),
        avg_c: avgGroup(firstThirdPositions, "avg_c"),
        avg_cta: avgGroup(firstThirdPositions, "avg_cta"),
        avg_time: avgGroup(firstThirdPositions, "avg_time"),
      };
      const lastThird = {
        avg_r: avgGroup(lastThirdPositions, "avg_r"),
        avg_i: avgGroup(lastThirdPositions, "avg_i"),
        avg_f: avgGroup(lastThirdPositions, "avg_f"),
        avg_c: avgGroup(lastThirdPositions, "avg_c"),
        avg_cta: avgGroup(lastThirdPositions, "avg_cta"),
        avg_time: avgGroup(lastThirdPositions, "avg_time"),
      };
      const delta = {
        r: firstThird.avg_r > 0 ? Math.round(((lastThird.avg_r - firstThird.avg_r) / firstThird.avg_r) * 10000) / 100 : 0,
        i: firstThird.avg_i > 0 ? Math.round(((lastThird.avg_i - firstThird.avg_i) / firstThird.avg_i) * 10000) / 100 : 0,
        f: firstThird.avg_f > 0 ? Math.round(((lastThird.avg_f - firstThird.avg_f) / firstThird.avg_f) * 10000) / 100 : 0,
        c: firstThird.avg_c > 0 ? Math.round(((lastThird.avg_c - firstThird.avg_c) / firstThird.avg_c) * 10000) / 100 : 0,
        cta: firstThird.avg_cta > 0 ? Math.round(((lastThird.avg_cta - firstThird.avg_cta) / firstThird.avg_cta) * 10000) / 100 : 0,
        time: firstThird.avg_time > 0 ? Math.round(((lastThird.avg_time - firstThird.avg_time) / firstThird.avg_time) * 10000) / 100 : 0,
      };

      return {
        completedRespondentsAnalyzed: completedIds.size,
        maxPosition: maxPos + 1,
        perPosition,
        firstThird,
        lastThird,
        delta,
      };
    })();

    // ── Completion Funnel Analysis ───────────────────────────
    // Shows how many respondents reached each step, identifying dropout points.
    // IMPORTANT: Wizard sends NORMALIZED step values to the API:
    //   0 = started (welcome only)
    //   1 = demographics saved
    //   2 = behavioral saved
    //   3 = psychographic saved
    //   4+ = stimulus sub-steps: step = (wizardStep - 17) + 4
    //        Stimulus 0: steps 4-9, Stimulus 1: steps 10-15, etc.
    //   completed_at IS SET when survey is done (separate from step_completed)
    const completionFunnel = (() => {
      // Determine how many stimuli a respondent actually evaluates.
      // Wizard sends step = groupIdx + 4 for each stimulus (groupIdx = 0,1,2,...N-1)
      // So step_completed for stimulus evaluation goes: 4, 5, 6, 7, ... (N+3)
      // Best heuristic: count responses per completed respondent, take the maximum.
      const completedResps = respondents.filter(isEffectivelyCompleted);
      let actualStimuliCount = 0;
      if (completedResps.length > 0) {
        const respCounts: number[] = completedResps.map(r => {
          return allFilteredResponses.filter(resp => resp.respondent_id === r.id).length;
        });
        actualStimuliCount = Math.max(...respCounts, 0);
      }
      if (actualStimuliCount === 0) {
        // Fallback: derive from max step_completed across all respondents
        // step = groupIdx + 4, so stimuliCount = maxStep - 4 + 1
        const maxStep = Math.max(...respondents.map(r => r.step_completed || 0), 0);
        if (maxStep >= 4) {
          actualStimuliCount = maxStep - 4 + 1;
        }
      }
      // Final fallback: if still 0, use total stimuli from DB (but cap at reasonable number)
      const stimuliForFunnel = actualStimuliCount > 0 ? actualStimuliCount : Math.min((stimuli || []).length, 10);

      // Build milestones using NORMALIZED step values (as stored in DB)
      const milestones: { step: number; label: string }[] = [
        { step: 0, label: "Inceput (Welcome)" },
        { step: 1, label: "Demografie" },
        { step: 2, label: "Comportament" },
        { step: 3, label: "Psihografic" },
      ];

      // Wizard sends step = groupIdx + 4 for each stimulus
      // So Stimul 1 → step 4, Stimul 2 → step 5, ..., Stimul N → step N+3
      for (let s = 0; s < stimuliForFunnel; s++) {
        milestones.push({ step: 4 + s, label: `Stimul ${s + 1}` });
      }

      // "Completed" = has completed_at set (separate check, not step-based)
      // Use a very high step number as sentinel for completed
      const COMPLETED_SENTINEL = 9999;
      milestones.push({ step: COMPLETED_SENTINEL, label: "Completat" });

      // Build cumulative funnel
      const funnelSteps: { step: number; label: string; reached: number; rate: number; dropped: number }[] = [];

      for (let i = 0; i < milestones.length; i++) {
        const ms = milestones[i];
        let reached: number;

        if (ms.step === COMPLETED_SENTINEL) {
          // "Completed" means completed_at is set OR all stimuli evaluated
          reached = respondents.filter(isEffectivelyCompleted).length;
        } else {
          reached = respondents.filter(r => (r.step_completed || 0) >= ms.step).length;
        }

        const prevReached = i > 0 ? funnelSteps[i - 1].reached : totalRespondents;

        funnelSteps.push({
          step: ms.step,
          label: ms.label,
          reached,
          rate: totalRespondents > 0 ? Math.round((reached / totalRespondents) * 100) : 0,
          dropped: prevReached - reached,
        });
      }

      // Identify worst dropout point
      let worstDropout = { step: 0, label: "", dropped: 0, dropRate: 0 };
      for (let i = 1; i < funnelSteps.length; i++) {
        const prev = funnelSteps[i - 1];
        const curr = funnelSteps[i];
        const dropRate = prev.reached > 0 ? Math.round(((prev.reached - curr.reached) / prev.reached) * 100) : 0;
        if (curr.dropped > worstDropout.dropped) {
          worstDropout = { step: curr.step, label: curr.label, dropped: curr.dropped, dropRate };
        }
      }

      // Session time distribution (buckets)
      const timeBuckets = { under5m: 0, m5to15: 0, m15to30: 0, m30to60: 0, over60m: 0 };
      for (const d of durations) {
        if (d < 300) timeBuckets.under5m++;
        else if (d < 900) timeBuckets.m5to15++;
        else if (d < 1800) timeBuckets.m15to30++;
        else if (d < 3600) timeBuckets.m30to60++;
        else timeBuckets.over60m++;
      }

      return {
        totalStarted: totalRespondents,
        totalCompleted: completedRespondents,
        overallRate: totalRespondents > 0 ? Math.round((completedRespondents / totalRespondents) * 100) : 0,
        funnelSteps,
        worstDropout,
        medianSessionTime: durations.length > 0 ? durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)] : 0,
        avgSessionTime,
        timeBuckets,
      };
    })();

    return NextResponse.json({
      totalRespondents,
      completedRespondents,
      // Temporary debug — remove after verifying sync
      _syncDebug: {
        respondentsLength: respondents.length,
        allResponsesFromDB: (allResponseData || []).length,
        filteredResponses: allFilteredResponses.length,
        expectedResponseCount,
        completedByCompletedAt: respondents.filter((r: any) => r.completed_at != null).length,
        completedByRespCount: respondents.filter((r: any) => expectedResponseCount > 0 && (respCountByRespondent[r.id] || 0) >= expectedResponseCount).length,
        distributionFilter: distributionId || "none",
        monthFilter: monthParam || "none",
      },
      completionRate: totalRespondents > 0 ? Math.round((completedRespondents / totalRespondents) * 100) : 0,
      totalResponses,
      completedToday,
      completedMonth,
      avgSessionTime,
      distributionSummary,
      stimuliResults,
      aiEvaluations: aiEvaluations || [],
      demographics,
      behavioral: behavioralData,
      psychographicAvg,
      localeCounts: globalLocaleCounts,
      perCategoryBreakdowns,
      perStimulusBreakdowns,
      fatigueAnalysis,
      completionFunnel,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal error", message: err?.message || "Unknown" },
      { status: 500 }
    );
  }
}
