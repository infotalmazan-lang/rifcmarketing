import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET ?token=xxx — resolve token → campaign + evaluation + KPIs (bias-safe)
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const token = new URL(req.url).searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    // Find campaign by eval1_token or eval2_token
    const { data: byT1 } = await supabase.from("predictive_campaigns")
      .select("*")
      .eq("eval1_token", token)
      .maybeSingle();

    const { data: byT2 } = !byT1
      ? await supabase.from("predictive_campaigns").select("*").eq("eval2_token", token).maybeSingle()
      : { data: null };

    const campaign = byT1 || byT2;
    if (!campaign) return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });

    const evaluatorNumber = byT1 ? 1 : 2;

    // Get company info
    const { data: company } = await supabase.from("predictive_companies")
      .select("name, industry")
      .eq("id", campaign.company_id)
      .single();

    // Get existing evaluation for this evaluator
    const { data: evaluation } = await supabase.from("predictive_evaluations")
      .select("*")
      .eq("campaign_id", campaign.id)
      .eq("evaluator_number", evaluatorNumber)
      .maybeSingle();

    // Only return KPIs if evaluator has reached screen 3 (bias prevention)
    let kpis: unknown[] = [];
    if (evaluation && evaluation.current_screen >= 3) {
      const { data: kpiData } = await supabase.from("predictive_kpis")
        .select("*")
        .eq("evaluation_id", evaluation.id)
        .order("created_at", { ascending: true });
      kpis = kpiData || [];
    }

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        channel: campaign.channel,
        campaign_type: campaign.campaign_type,
        creative_image_url: campaign.creative_image_url,
        creative_link: campaign.creative_link,
        period_start: campaign.period_start,
        period_end: campaign.period_end,
        is_active: campaign.is_active,
      },
      company: company || { name: "N/A", industry: "N/A" },
      evaluator_number: evaluatorNumber,
      evaluation: evaluation || null,
      kpis,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — evaluator updates scores/comments/screen/KPIs via token
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { token, ...fields } = body;
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    // Resolve token
    const { data: byT1 } = await supabase.from("predictive_campaigns")
      .select("id")
      .eq("eval1_token", token)
      .maybeSingle();
    const { data: byT2 } = !byT1
      ? await supabase.from("predictive_campaigns").select("id").eq("eval2_token", token).maybeSingle()
      : { data: null };

    const campaign = byT1 || byT2;
    if (!campaign) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

    const evaluatorNumber = byT1 ? 1 : 2;

    // Separate KPI data from evaluation data
    const { kpis, ...evalFields } = fields;

    // Upsert evaluation
    const { data: existing } = await supabase.from("predictive_evaluations")
      .select("id")
      .eq("campaign_id", campaign.id)
      .eq("evaluator_number", evaluatorNumber)
      .maybeSingle();

    let evaluation;
    if (existing) {
      const { data, error } = await supabase.from("predictive_evaluations")
        .update(evalFields)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      evaluation = data;
    } else {
      const { data, error } = await supabase.from("predictive_evaluations")
        .insert({ campaign_id: campaign.id, evaluator_number: evaluatorNumber, ...evalFields })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      evaluation = data;
    }

    // Handle KPIs if provided (array of {kpi_name, kpi_value, kpi_unit, data_source, notes})
    if (kpis && Array.isArray(kpis) && evaluation) {
      // Delete old KPIs and insert new ones
      await supabase.from("predictive_kpis").delete().eq("evaluation_id", evaluation.id);
      if (kpis.length > 0) {
        const kpiRows = kpis.map((k: { kpi_name: string; kpi_value: number; kpi_unit: string; data_source?: string; notes?: string }) => ({
          evaluation_id: evaluation.id,
          kpi_name: k.kpi_name,
          kpi_value: k.kpi_value,
          kpi_unit: k.kpi_unit || "",
          data_source: k.data_source || null,
          notes: k.notes || null,
        }));
        await supabase.from("predictive_kpis").insert(kpiRows);
      }
    }

    return NextResponse.json({ success: true, evaluation });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
