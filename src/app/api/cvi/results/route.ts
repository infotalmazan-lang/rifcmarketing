import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";
import {
  CVI_ITEMS,
  CVI_ITEM_LABELS,
  buildCviSummary,
  calcFleissKappa,
} from "@/lib/cvi-calculations";

export const revalidate = 0;

// GET /api/cvi/results — Admin: full CVI results + statistics
export async function GET() {
  try {
    const supabase = createServiceRole();

    // Fetch all completed responses
    const { data: responses, error: respError } = await supabase
      .from("cvi_responses")
      .select("*")
      .order("submitted_at", { ascending: true });

    if (respError) {
      return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 });
    }

    // Fetch expert stats (including hidden flag if column exists)
    const { data: experts } = await supabase
      .from("cvi_experts")
      .select("*")
      .order("created_at", { ascending: true });

    // Build set of hidden expert IDs to exclude from calculations
    const hiddenIds = new Set(
      (experts || []).filter(e => e.hidden === true).map(e => e.id)
    );

    // Filter out responses from hidden experts
    const responseData = ((responses || []) as Record<string, unknown>[]).filter(
      r => !hiddenIds.has(r.expert_id as string)
    );

    // Build per-item ratings arrays
    const ratingsPerExpert: Record<string, number>[] = responseData.map(r => {
      const obj: Record<string, number> = {};
      for (const item of CVI_ITEMS) {
        const val = r[item];
        if (typeof val === "number") obj[item] = val;
      }
      return obj;
    });

    // CVI Summary per item
    const summary = buildCviSummary(ratingsPerExpert);

    // Fleiss Kappa: build matrix [items x raters]
    let fleissKappa = 0;
    if (ratingsPerExpert.length >= 2) {
      const matrix: number[][] = CVI_ITEMS.map(item =>
        ratingsPerExpert.map(r => r[item] || 0)
      );
      fleissKappa = Number(calcFleissKappa(matrix).toFixed(3));
    }

    // CVI per dimension (average across items)
    const dimCvi: Record<string, number> = {};
    for (const dim of ["R", "I", "F", "C"]) {
      const dimItems = summary.filter(s => s.construct === dim);
      const avg = dimItems.length > 0
        ? dimItems.reduce((sum, s) => sum + s.cvi_score, 0) / dimItems.length
        : 0;
      dimCvi[dim] = Number(avg.toFixed(2));
    }

    // Items below threshold
    const itemsBelowThreshold = summary.filter(s => s.cvi_score > 0 && s.cvi_score < 0.80);

    // Anonymized export data (no names, just roles + scores)
    const exportData = responseData.map(r => {
      const row: Record<string, unknown> = {};
      for (const item of CVI_ITEMS) {
        row[item] = r[item];
      }
      row.cvi_r = r.cvi_r;
      row.cvi_i = r.cvi_i;
      row.cvi_f = r.cvi_f;
      row.cvi_c = r.cvi_c;
      row.cvi_total = r.cvi_total;
      return row;
    });

    // ── Comments data: per-expert per-item justifications ──
    // Links expert_id → comments JSONB, plus their scores for context
    const commentsData: {
      expert_id: string;
      expert_name: string;
      expert_role: string;
      comments: Record<string, string>;
      scores: Record<string, number>;
    }[] = [];

    for (const r of responseData) {
      const rawComments = (r.comments && typeof r.comments === "object") ? r.comments as Record<string, string> : {};
      // Only include if there are actual comments
      if (Object.keys(rawComments).length === 0) continue;
      const exp = (experts || []).find(e => e.id === r.expert_id);
      const scores: Record<string, number> = {};
      for (const item of CVI_ITEMS) {
        const val = r[item];
        if (typeof val === "number") scores[item] = val;
      }
      commentsData.push({
        expert_id: String(r.expert_id || ""),
        expert_name: exp?.name || "Expert anonim",
        expert_role: exp?.role || "",
        comments: rawComments,
        scores,
      });
    }

    return NextResponse.json({
      summary,
      dimensionCvi: dimCvi,
      fleissKappa,
      stats: {
        totalExperts: experts?.length || 0,
        completed: experts?.filter(e => e.status === "completed" && !e.hidden).length || 0,
        pending: experts?.filter(e => e.status === "pending").length || 0,
        hidden: experts?.filter(e => e.hidden === true).length || 0,
        totalResponses: responseData.length,
      },
      itemsBelowThreshold,
      exportData,
      commentsData,
      experts: (experts || []).map(e => ({
        id: e.id,
        name: e.name,
        role: e.role,
        experience: e.experience,
        status: e.status,
        completed_at: e.completed_at,
        hidden: e.hidden || false,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
