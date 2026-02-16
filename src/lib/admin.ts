import { createServerSupabase, createServiceRole } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function verifyAdmin() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
      supabase: createServiceRole(),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
      supabase: createServiceRole(),
    };
  }

  return { error: null, user, supabase: createServiceRole() };
}
