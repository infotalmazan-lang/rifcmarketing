import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const body = await request.json();

  if (!body.title || !body.description) {
    return NextResponse.json({ error: "Title and description required" }, { status: 400 });
  }

  const { data, error: dbError } = await supabase
    .from("case_studies")
    .insert(body)
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
