import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, step, type, data } = body;

    if (!sessionId || step === undefined || !type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, step, type, data" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();

    // Get respondent
    const { data: respondent, error: findError } = await supabase
      .from("survey_respondents")
      .select("id, step_completed")
      .eq("session_id", sessionId)
      .single();

    if (findError || !respondent) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const respondentId = respondent.id;
    const newStep = Math.max(respondent.step_completed, step);

    if (type === "demographic") {
      await supabase
        .from("survey_respondents")
        .update({
          demographics: data,
          step_completed: newStep,
        })
        .eq("id", respondentId);
    } else if (type === "behavioral") {
      await supabase
        .from("survey_respondents")
        .update({
          behavioral: data,
          step_completed: newStep,
        })
        .eq("id", respondentId);
    } else if (type === "psychographic") {
      await supabase
        .from("survey_respondents")
        .update({
          psychographic: data,
          step_completed: newStep,
        })
        .eq("id", respondentId);
    } else if (type === "stimulus") {
      // Upsert stimulus response (5 dimensions: R, I, F, C, CTA + brand familiarity)
      // NOTE: c_computed is a GENERATED column in PostgreSQL (auto: r_score + i_score * f_score)
      // Do NOT include it in upsert — DB computes it automatically
      const upsertData: Record<string, unknown> = {
        respondent_id: respondentId,
        stimulus_id: data.stimulusId,
        r_score: Number(data.rScore) || 0,
        i_score: Number(data.iScore) || 0,
        f_score: Number(data.fScore) || 0,
        c_score: data.cScore || null,
        cta_score: data.ctaScore || null,
        time_spent_seconds: data.timeSpentSeconds || 0,
      };
      if (data.brandFamiliar !== undefined) {
        upsertData.brand_familiar = data.brandFamiliar;
      }

      let { error: upsertError } = await supabase
        .from("survey_responses")
        .upsert(upsertData, { onConflict: "respondent_id,stimulus_id" });

      // Fallback: if brand_familiar column doesn't exist yet, retry without it
      if (upsertError && upsertError.message?.includes("brand_familiar")) {
        delete upsertData.brand_familiar;
        const retry = await supabase.from("survey_responses").upsert(upsertData, { onConflict: "respondent_id,stimulus_id" });
        upsertError = retry.error;
      }

      if (upsertError) {
        return NextResponse.json(
          { error: "Failed to save response" },
          { status: 500 }
        );
      }

      // Save attention check result if present
      if (data.attentionCheckPassed !== undefined) {
        await supabase
          .from("survey_respondents")
          .update({ attention_check_passed: data.attentionCheckPassed })
          .eq("id", respondentId);
      }

      // Update step — mark complete if client says this is the last stimulus
      const isComplete = !!data.isLast;
      await supabase
        .from("survey_respondents")
        .update({
          step_completed: newStep,
          ...(isComplete ? { completed_at: new Date().toISOString() } : {}),
        })
        .eq("id", respondentId);
    } else if (type === "complete") {
      await supabase
        .from("survey_respondents")
        .update({
          step_completed: newStep,
          completed_at: new Date().toISOString(),
        })
        .eq("id", respondentId);
    }

    return NextResponse.json({
      success: true,
      stepCompleted: newStep,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
