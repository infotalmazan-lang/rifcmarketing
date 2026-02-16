import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const body = await request.json();

  const { error: dbError } = await supabase
    .from("blog_categories")
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
    .from("blog_categories")
    .delete()
    .eq("id", params.id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
