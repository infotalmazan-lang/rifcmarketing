import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { role } = await request.json();

  if (!role || !["user", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", params.id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
