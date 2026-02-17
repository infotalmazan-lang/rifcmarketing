import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export const revalidate = 0; // No cache for admin operations

export async function GET() {
  try {
    const supabase = createServiceRole();

    const { data: categories, error } = await supabase
      .from("survey_categories")
      .select("*")
      .order("display_order");

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: categories || [] });
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
    const { id, label, color, display_order, is_visible, short_code } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing category id" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();

    const updates: Record<string, unknown> = {};
    if (label !== undefined) updates.label = label;
    if (color !== undefined) updates.color = color;
    if (display_order !== undefined) updates.display_order = display_order;
    if (is_visible !== undefined) updates.is_visible = is_visible;
    if (short_code !== undefined) updates.short_code = short_code;

    const { data, error } = await supabase
      .from("survey_categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update category" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, category: data });
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
    const { type, label, short_code, color, display_order, max_materials } = body;

    if (!type || !label || !short_code) {
      return NextResponse.json(
        { error: "Missing required fields: type, label, short_code" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();

    const { data, error } = await supabase
      .from("survey_categories")
      .insert({
        type,
        label,
        short_code,
        color: color || "#6B7280",
        display_order: display_order || 0,
        max_materials: max_materials || 3,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create category" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, category: data });
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
        { error: "Missing category id" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();

    const { error } = await supabase
      .from("survey_categories")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete category" },
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
