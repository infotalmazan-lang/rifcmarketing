import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { error: dbError } = await supabase
    .from("content_overrides")
    .delete()
    .eq("id", params.id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
