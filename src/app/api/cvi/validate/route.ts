import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const revalidate = 0;

// GET /api/cvi/validate?token=XXX
// Validates a CVI expert token — returns status without creating anything
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const supabase = createServiceRole();

    const { data: expert, error } = await supabase
      .from("cvi_experts")
      .select("id, token, name, status, created_at")
      .eq("token", token)
      .single();

    if (error || !expert) {
      return NextResponse.json(
        { valid: false, reason: "invalid" },
        { status: 404 }
      );
    }

    if (expert.status === "completed") {
      return NextResponse.json(
        { valid: false, reason: "completed", name: expert.name },
        { status: 409 }
      );
    }

    if (expert.status === "revoked") {
      return NextResponse.json(
        { valid: false, reason: "revoked" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      valid: true,
      expert_id: expert.id,
      name: expert.name,
      status: expert.status,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
