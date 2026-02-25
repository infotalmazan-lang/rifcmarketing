import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export const revalidate = 0;

// POST /api/cvi/generate-tokens
// Admin: create a new CVI expert with profile + unique token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const invitedBy = body.invited_by || "talmazan";

    const supabase = createServiceRole();

    // Single expert with profile data
    const token = randomUUID();
    const insertData: Record<string, unknown> = {
      token,
      invited_by: invitedBy,
    };

    // Optional profile fields (pre-filled by admin)
    if (body.name) insertData.name = body.name.trim();
    if (body.org) insertData.org = body.org.trim();
    if (body.role) insertData.role = body.role.trim();
    if (body.experience) insertData.experience = body.experience.trim();
    if (body.email) insertData.email = body.email.trim();

    const { data, error } = await supabase
      .from("cvi_experts")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create expert" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      expert: data,
      token,
      link: `https://rifcmarketing.com/articolstiintific/cvi?token=${token}`,
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

// PATCH /api/cvi/generate-tokens — update expert profile
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing expert id" }, { status: 400 });
    }

    const supabase = createServiceRole();

    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name?.trim() || null;
    if (updates.org !== undefined) updateData.org = updates.org?.trim() || null;
    if (updates.role !== undefined) updateData.role = updates.role?.trim() || null;
    if (updates.experience !== undefined) updateData.experience = updates.experience?.trim() || null;
    if (updates.email !== undefined) updateData.email = updates.email?.trim() || null;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { data, error } = await supabase
      .from("cvi_experts")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update expert" }, { status: 500 });
    }

    return NextResponse.json({ success: true, expert: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/cvi/generate-tokens?token=XXX — revoke a token
// DELETE /api/cvi/generate-tokens?id=XXX&hard=1 — permanently delete
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const hard = searchParams.get("hard");

    const supabase = createServiceRole();

    if (hard && id) {
      // Hard delete: remove from DB
      // First delete any responses
      await supabase.from("cvi_responses").delete().eq("expert_id", id);
      const { error } = await supabase.from("cvi_experts").delete().eq("id", id);
      if (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    if (token) {
      // Soft revoke
      const { error } = await supabase
        .from("cvi_experts")
        .update({ status: "revoked" })
        .eq("token", token)
        .eq("status", "pending");

      if (error) {
        return NextResponse.json({ error: "Failed to revoke" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing token or id" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
