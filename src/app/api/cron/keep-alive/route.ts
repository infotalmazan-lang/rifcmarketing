import { createServiceRole } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Daily cron — prevents Supabase free-tier project from pausing
// Configured in vercel.json: runs at 06:00 UTC every day
export async function GET(request: Request) {
  // Verify cron secret (Vercel sets this automatically for cron jobs)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceRole();
    // Simple query to keep the database active
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      profiles: count,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
