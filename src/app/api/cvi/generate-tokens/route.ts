import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export const revalidate = 0;

// POST /api/cvi/generate-tokens
// Admin: generate N unique CVI expert tokens
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const count = Math.min(Math.max(body.count || 1, 1), 50); // 1-50
    const invitedBy = body.invited_by || "talmazan";

    const supabase = createServiceRole();

    const tokens: { token: string; link: string }[] = [];

    for (let i = 0; i < count; i++) {
      const token = randomUUID();
      const { error } = await supabase
        .from("cvi_experts")
        .insert({ token, invited_by: invitedBy });

      if (!error) {
        tokens.push({
          token,
          link: `https://rifcmarketing.com/articolstiintific/cvi?token=${token}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: tokens.length,
      tokens,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET /api/cvi/generate-tokens — list all experts with tokens
export async function GET() {
  try {
    const supabase = createServiceRole();

    const { data: experts, error } = await supabase
      .from("cvi_experts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch experts" }, { status: 500 });
    }

    return NextResponse.json({
      experts: experts || [],
      stats: {
        total: experts?.length || 0,
        completed: experts?.filter(e => e.status === "completed").length || 0,
        pending: experts?.filter(e => e.status === "pending").length || 0,
        revoked: experts?.filter(e => e.status === "revoked").length || 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/cvi/generate-tokens?token=XXX — revoke a token
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const supabase = createServiceRole();

    const { error } = await supabase
      .from("cvi_experts")
      .update({ status: "revoked" })
      .eq("token", token)
      .eq("status", "pending");

    if (error) {
      return NextResponse.json({ error: "Failed to revoke" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
