import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const revalidate = 0;

/* ── GET — Load progress from Supabase ── */
export async function GET() {
  try {
    const supabase = createServiceRole();
    const { data, error } = await supabase
      .from("article_progress")
      .select("tasks, blocks, updated_at")
      .eq("id", "singleton")
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tasks: data?.tasks || {},
      blocks: data?.blocks || {},
      updated_at: data?.updated_at || null,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/* ── PUT — Save/update progress ── */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { tasks, blocks } = body;

    if (tasks === undefined && blocks === undefined) {
      return NextResponse.json({ error: "Nothing to save" }, { status: 400 });
    }

    const supabase = createServiceRole();
    const updateData: Record<string, unknown> = {
      id: "singleton",
      updated_at: new Date().toISOString(),
    };
    if (tasks !== undefined) updateData.tasks = tasks;
    if (blocks !== undefined) updateData.blocks = blocks;

    const { error } = await supabase
      .from("article_progress")
      .upsert(updateData);

    if (error) {
      return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
