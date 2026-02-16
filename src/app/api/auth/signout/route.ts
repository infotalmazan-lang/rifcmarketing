import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();

  const referer = request.headers.get("referer") || "/";
  const isAdmin = referer.includes("/admin");

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectUrl = isAdmin ? `${baseUrl}/admin/login` : `${baseUrl}/`;

  return NextResponse.redirect(redirectUrl, { status: 302 });
}
