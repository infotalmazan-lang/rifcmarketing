import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, phone, message, budget_range } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();

    const { error } = await supabase.from("consulting_requests").insert({
      name,
      email,
      company: company || null,
      phone: phone || null,
      message,
      budget_range: budget_range || null,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
