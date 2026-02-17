import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const revalidate = 300; // Cache 5 minutes

export async function GET() {
  try {
    const supabase = createServiceRole();

    const { data: stimuli, error } = await supabase
      .from("survey_stimuli")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch stimuli" },
        { status: 500 }
      );
    }

    return NextResponse.json({ stimuli: stimuli || [] });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
