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
      // Upsert stimulus response
      const { error: upsertError } = await supabase
        .from("survey_responses")
        .upsert(
          {
            respondent_id: respondentId,
            stimulus_id: data.stimulusId,
            r_score: data.rScore,
            i_score: data.iScore,
            f_score: data.fScore,
            time_spent_seconds: data.timeSpentSeconds || 0,
          },
          { onConflict: "respondent_id,stimulus_id" }
        );

      if (upsertError) {
        console.error("Failed to save response:", upsertError);
        return NextResponse.json(
          { error: "Failed to save response" },
          { status: 500 }
        );
      }

      // Update step
      const isComplete = step >= 12;
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
