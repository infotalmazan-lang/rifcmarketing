import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Generate a short, URL-safe access token
function generateToken(): string {
  return crypto.randomBytes(24).toString("base64url"); // 32 chars, URL-safe
}

// GET — list all experts
export async function GET() {
  try {
    const supabase = createServiceRole();

    const { data, error } = await supabase
      .from("survey_experts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({ success: true, experts: [], needsMigration: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, experts: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — create a new expert (generates unique access token + link)
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { first_name, last_name, email, phone, photo_url, experience_years, brands_worked, total_budget_managed, marketing_roles } = body;

    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: "Campuri obligatorii: first_name, last_name" },
        { status: 400 }
      );
    }

    const access_token = generateToken();

    const insertData = {
      first_name,
      last_name,
      email: email || null,
      phone: phone || null,
      photo_url: photo_url || null,
      experience_years: experience_years || null,
      brands_worked: brands_worked || [],
      total_budget_managed: total_budget_managed || null,
      marketing_roles: marketing_roles || [],
      access_token,
      is_active: true,
    };

    let { data, error } = await supabase
      .from("survey_experts")
      .insert(insertData)
      .select()
      .single();

    // If columns don't exist yet, auto-migrate and retry
    if (error && (error.message.includes("column") || error.code === "42703")) {
      await supabase.rpc("exec_sql", {
        sql_text: `ALTER TABLE public.survey_experts
          ADD COLUMN IF NOT EXISTS experience_years smallint,
          ADD COLUMN IF NOT EXISTS brands_worked text[] DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS total_budget_managed numeric,
          ADD COLUMN IF NOT EXISTS marketing_roles text[] DEFAULT '{}';`
      });
      const retry = await supabase.from("survey_experts").insert(insertData).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, expert: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT — update expert (name, email, phone, photo, or revoke/restore access)
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing expert id" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    const allowed = ["first_name", "last_name", "email", "phone", "photo_url", "is_active",
      "experience_years", "brands_worked", "total_budget_managed", "marketing_roles"];
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }

    // If revoking access, set revoked_at
    if (fields.is_active === false) {
      updates.revoked_at = new Date().toISOString();
    }
    // If restoring access, clear revoked_at and regenerate token
    if (fields.is_active === true) {
      updates.revoked_at = null;
      updates.access_token = generateToken();
    }

    let { data, error } = await supabase
      .from("survey_experts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    // If columns don't exist yet, auto-migrate and retry
    if (error && (error.message.includes("column") || error.code === "42703")) {
      await supabase.rpc("exec_sql", {
        sql_text: `ALTER TABLE public.survey_experts
          ADD COLUMN IF NOT EXISTS experience_years smallint,
          ADD COLUMN IF NOT EXISTS brands_worked text[] DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS total_budget_managed numeric,
          ADD COLUMN IF NOT EXISTS marketing_roles text[] DEFAULT '{}';`
      });
      const retry = await supabase.from("survey_experts").update(updates).eq("id", id).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, expert: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE — hard delete expert + their evaluations
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing expert id" }, { status: 400 });
    }

    // Delete evaluations first (FK)
    await supabase
      .from("survey_expert_evaluations")
      .delete()
      .eq("expert_id", id);

    const { error } = await supabase
      .from("survey_experts")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
