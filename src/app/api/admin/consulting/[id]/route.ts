import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const body = await request.json();
  const { status, admin_notes } = body;

  const { error: updateError } = await supabase
    .from("consulting_requests")
    .update({ status, admin_notes })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
