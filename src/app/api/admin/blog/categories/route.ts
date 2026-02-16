import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("blog_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const body = await request.json();
  const { name, slug, description } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("blog_categories")
    .insert({ name, slug, description: description || null })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
