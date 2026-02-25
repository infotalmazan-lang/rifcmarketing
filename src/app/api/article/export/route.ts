import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const revalidate = 0;

/**
 * GET /api/article/export — Export all article progress as JSON
 * Returns a downloadable JSON file with tasks + blocks from Supabase
 * Used for Git-tracked backups so data doesn't depend on browser localStorage
 */
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

    const exportData = {
      _meta: {
        exportedAt: new Date().toISOString(),
        version: "v4",
        source: "supabase",
        description: "RIFC Articol Stiintific — tasks & blocks backup",
      },
      tasks: data?.tasks || {},
      blocks: data?.blocks || {},
      updated_at: data?.updated_at || null,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="rifc-article-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
