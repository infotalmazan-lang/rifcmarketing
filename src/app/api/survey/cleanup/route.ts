import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { confirm } = await request.json();
    if (confirm !== "DELETE_TEST_DATA") {
      return NextResponse.json({ error: "Must confirm with DELETE_TEST_DATA" }, { status: 400 });
    }

    const supabase = createServiceRole();

    // 1. Delete all survey responses
    const { error: e1 } = await supabase
      .from("survey_responses")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    // 2. Delete all survey respondents
    const { error: e2 } = await supabase
      .from("survey_respondents")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    const errors = [e1, e2].filter(Boolean);
    if (errors.length > 0) {
      return NextResponse.json({
        ok: false,
        errors: errors.map(e => e!.message),
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      deleted: {
        responses: "all",
        respondents: "all",
      },
      preserved: ["categories", "stimuli", "distributions", "expert_evaluations", "ai_evaluations"],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
