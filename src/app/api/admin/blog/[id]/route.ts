import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("blog_posts")
    .select("*, category:blog_categories(*)")
    .eq("id", params.id)
    .single();

  if (dbError) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const body = await request.json();

  const { error: dbError } = await supabase
    .from("blog_posts")
    .update(body)
    .eq("id", params.id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { error: dbError } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", params.id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
