import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(request.url);
    const distributionId = searchParams.get("distribution_id");

    // Build respondent query — use select("*") for reliable column retrieval
    // (PostgREST can return inconsistent results with specific column selects on JSONB tables)
    // Always exclude archived respondents (is_archived = false OR null for pre-migration rows)
    let respondentQuery = supabase
      .from("survey_respondents")
      .select("*")
      .or("is_archived.eq.false,is_archived.is.null");

    if (distributionId === "__none__") {
      // Filter for respondents with NO distribution (clean link / general)
      respondentQuery = respondentQuery.is("distribution_id", null);
    } else if (distributionId) {
      respondentQuery = respondentQuery.eq("distribution_id", distributionId);
    }

    const { data: filteredRespondents, error: respondentError } = await respondentQuery;

    // Use all non-archived respondents directly (LOG counts them all)
    const respondents = filteredRespondents || [];
    const totalRespondents = respondents.length;
    const respondentIds = respondents.map((r: { id: string }) => r.id);

    // Fetch responses — use individual queries per respondent batch to avoid .in() issues
    let allFilteredResponses: any[] = [];
    if (respondentIds.length > 0) {
      // Fetch responses in batches of respondent IDs (PostgREST .in() can miss rows with many UUIDs)
      const BATCH_SIZE = 10; // small batches of respondent IDs
      for (let i = 0; i < respondentIds.length; i += BATCH_SIZE) {
        const batchIds = respondentIds.slice(i, i + BATCH_SIZE);
        const PAGE_SIZE = 1000;
        let offset = 0;
        let hasMore = true;
        while (hasMore) {
          const { data: respData } = await supabase
            .from("survey_responses")
            .select("respondent_id, stimulus_id, r_score, i_score, f_score, c_computed, c_score, cta_score, time_spent_seconds, brand_familiar, created_at")
            .in("respondent_id", batchIds)
            .range(offset, offset + PAGE_SIZE - 1);
          const batch = respData || [];
          allFilteredResponses = allFilteredResponses.concat(batch);
          hasMore = batch.length === PAGE_SIZE;
          offset += PAGE_SIZE;
        }
      }
    }
    const totalResponses = allFilteredResponses.length;

    // Completed respondents — those with completed_at set
    const completedRespondents = respondents.filter(r => r.completed_at != null).length;

    // Today / this month / avg session time
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);
    const completedToday = respondents.filter(r => r.completed_at && (r.completed_at as string).slice(0, 10) === todayStr).length;
    const completedMonth = respondents.filter(r => r.completed_at && (r.completed_at as string).slice(0, 7) === monthStr).length;

    // Avg session duration (completed_at - started_at)
    const durations = respondents
      .filter(r => r.completed_at && r.started_at)
      .map(r => Math.round((new Date(r.completed_at as string).getTime() - new Date(r.started_at as string).getTime()) / 1000))
      .filter(s => s > 0 && s < 7200); // ignore outliers > 2h
    const avgSessionTime = durations.length > 0 ? Math.round(durations.reduce((a, v) => a + v, 0) / durations.length) : 0;

    // Build map: stimulus_id → responses[] (from filtered respondents only)
    const responsesByStimulus: Record<string, typeof allFilteredResponses> = {};
    for (const resp of allFilteredResponses) {
      if (!responsesByStimulus[resp.stimulus_id]) responsesByStimulus[resp.stimulus_id] = [];
      responsesByStimulus[resp.stimulus_id].push(resp);
    }

    // Per-stimulus aggregated results — ALL active stimuli
    const { data: stimuli } = await supabase
      .from("survey_stimuli")
      .select("id, name, type, industry, variant_label, execution_quality")
      .eq("is_active", true)
      .order("display_order");

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
            if (r.completed_at) distMap[did].completed++;
          } else {
            noDistTotal++;
            if (r.completed_at) noDistCompleted++;
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
        respondents.filter(r => r.completed_at != null).map(r => r.id)
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
    const completionFunnel = (() => {
      // Profile steps (fixed): 0=welcome, 1=gender, 2=age, 3=country, 4=urbanRural,
      // 5=income, 6=education, 7=purchaseFreq, 8=channels, 9=onlineTime, 10=device,
      // 11-16=psychographic
      const PROFILE_STEP_COUNT = 17; // steps 0-16
      const totalStimuli = (stimuli || []).length;
      const STEPS_PER_STIMULUS = 6; // R, I, F, C, CTA, BRAND
      const totalSteps = PROFILE_STEP_COUNT + (totalStimuli * STEPS_PER_STIMULUS) + 1; // +1 for thank-you

      // Labels for key steps
      const stepLabels: Record<number, string> = {
        0: "Welcome",
        1: "Gen",
        2: "Varsta",
        3: "Tara",
        4: "Urban/Rural",
        5: "Venit",
        6: "Educatie",
        7: "Frecventa cumparaturi",
        8: "Canale preferate",
        9: "Timp online",
        10: "Dispozitiv",
        11: "Psihografic 1",
        12: "Psihografic 2",
        13: "Psihografic 3",
        14: "Psihografic 4",
        15: "Psihografic 5",
        16: "Psihografic 6",
      };
      for (let s = 0; s < totalStimuli; s++) {
        const baseStep = PROFILE_STEP_COUNT + (s * STEPS_PER_STIMULUS);
        stepLabels[baseStep] = `Stimul ${s + 1} (R)`;
      }

      // Count respondents per step_completed
      const stepCounts: Record<number, number> = {};
      for (const r of respondents) {
        const sc = r.step_completed || 0;
        stepCounts[sc] = (stepCounts[sc] || 0) + 1;
      }

      // Build cumulative funnel: how many reached AT LEAST step X
      const funnelSteps: { step: number; label: string; reached: number; rate: number; dropped: number }[] = [];

      // Key milestone steps (don't enumerate every sub-step)
      const milestones = [
        0,  // Welcome
        1,  // Started demographics
        7,  // Finished demographics, started behavioral
        11, // Finished behavioral, started psychographic
        PROFILE_STEP_COUNT, // Finished profile, started stimuli
      ];
      // Add every stimulus start
      for (let s = 0; s < totalStimuli; s++) {
        milestones.push(PROFILE_STEP_COUNT + (s * STEPS_PER_STIMULUS));
      }
      // Add completion
      milestones.push(totalSteps);

      const uniqueMilestones = [...new Set(milestones)].sort((a, b) => a - b);

      for (const ms of uniqueMilestones) {
        const reached = respondents.filter(r => (r.step_completed || 0) >= ms).length;
        const prevReached = funnelSteps.length > 0 ? funnelSteps[funnelSteps.length - 1].reached : totalRespondents;

        let label = stepLabels[ms] || `Pas ${ms}`;
        if (ms === totalSteps) label = "Completat";
        if (ms >= PROFILE_STEP_COUNT && ms < totalSteps) {
          const stimIdx = Math.floor((ms - PROFILE_STEP_COUNT) / STEPS_PER_STIMULUS);
          if (stimIdx < totalStimuli) label = `Stimul ${stimIdx + 1}`;
        }

        funnelSteps.push({
          step: ms,
          label,
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

    // ── Debug info (temporary — helps diagnose production issues) ──
    const uniqueStimIdsInResponses = Array.from(new Set(allFilteredResponses.map(r => r.stimulus_id)));
    const activeStimIds = (stimuli || []).map(s => s.id);
    const orphanStimIds = uniqueStimIdsInResponses.filter(id => !activeStimIds.includes(id));

    return NextResponse.json({
      totalRespondents,
      completedRespondents,
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
      _debug: {
        respondentQueryError: respondentError?.message || null,
        respondentCount: respondents.length,
        completedRespondentCount: completedRespondents,
        responseCount: allFilteredResponses.length,
        activeStimuli: activeStimIds.length,
        uniqueStimIdsInResponses: uniqueStimIdsInResponses.length,
        hasOrphans: orphanStimIds.length > 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal error", message: err?.message || "Unknown" },
      { status: 500 }
    );
  }
}
