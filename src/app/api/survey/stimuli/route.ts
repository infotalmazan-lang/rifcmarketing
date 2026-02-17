import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const revalidate = 0; // No cache for admin CRUD

export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRole();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all"); // ?all=true to include inactive

    let query = supabase
      .from("survey_stimuli")
      .select("*")
      .order("display_order");

    if (!all) {
      query = query.eq("is_active", true);
    }

    const { data: stimuli, error } = await query;

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, industry, description, image_url, video_url, text_content, pdf_url, site_url, display_order } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Missing required fields: name, type" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();

    const { data, error } = await supabase
      .from("survey_stimuli")
      .insert({
        name,
        type,
        industry: industry || null,
        description: description || null,
        image_url: image_url || null,
        video_url: video_url || null,
        text_content: text_content || null,
        pdf_url: pdf_url || null,
        site_url: site_url || null,
        display_order: display_order || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create stimulus" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, stimulus: data });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing stimulus id" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();

    const updates: Record<string, unknown> = {};
    const allowed = ["name", "type", "industry", "description", "image_url", "video_url", "text_content", "pdf_url", "site_url", "display_order", "is_active"];
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }

    const { data, error } = await supabase
      .from("survey_stimuli")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update stimulus" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, stimulus: data });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing stimulus id" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();

    // Soft delete — set is_active = false
    const { error } = await supabase
      .from("survey_stimuli")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete stimulus" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
