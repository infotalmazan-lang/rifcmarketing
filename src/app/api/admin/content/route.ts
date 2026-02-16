import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("content_overrides")
    .select("*")
    .order("key_path");

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error, user, supabase } = await verifyAdmin();
  if (error) return error;

  const body = await request.json();
  const { locale, key_path, value } = body;

  if (!key_path || !value) {
    return NextResponse.json({ error: "key_path and value required" }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("content_overrides")
    .upsert(
      {
        locale: locale || "ro",
        key_path,
        value,
        updated_by: user!.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "locale,key_path" }
    );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
