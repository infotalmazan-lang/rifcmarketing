import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("seo_overrides")
    .select("*")
    .order("page_path");

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error, user, supabase } = await verifyAdmin();
  if (error) return error;

  const body = await request.json();
  const { page_path, meta_title, meta_description, og_image_url } = body;

  if (!page_path) {
    return NextResponse.json({ error: "page_path required" }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("seo_overrides")
    .upsert(
      {
        page_path,
        meta_title,
        meta_description,
        og_image_url,
        updated_by: user!.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "page_path" }
    );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
