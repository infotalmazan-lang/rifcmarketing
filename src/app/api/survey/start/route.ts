import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";
import { randomUUID, createHash } from "crypto";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function detectDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|android.*mobile/i.test(ua)) return "mobile";
  return "desktop";
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(request: Request) {
  try {
    const supabase = createServiceRole();
    const sessionId = randomUUID();
    const ip = getClientIp(request);
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    const ua = request.headers.get("user-agent") || "";
    const deviceType = detectDevice(ua);

    // Create respondent
    const { error: respError } = await supabase
      .from("survey_respondents")
      .insert({
        session_id: sessionId,
        step_completed: 0,
        ip_hash: ipHash,
        user_agent: ua.slice(0, 255),
        device_type: deviceType,
      });

    if (respError) {
      console.error("Failed to create respondent:", respError);
      return NextResponse.json(
        { error: "Failed to start survey" },
        { status: 500 }
      );
    }

    // Fetch active stimuli
    const { data: stimuli, error: stimError } = await supabase
      .from("survey_stimuli")
      .select("id, name, type, industry, description, image_url, video_url, text_content, pdf_url, site_url, display_order")
      .eq("is_active", true)
      .order("display_order");

    if (stimError) {
      console.error("Failed to fetch stimuli:", stimError);
      return NextResponse.json(
        { error: "Failed to load stimuli" },
        { status: 500 }
      );
    }

    // Randomize order per respondent
    const shuffledStimuli = shuffleArray(stimuli || []);

    return NextResponse.json({
      success: true,
      sessionId,
      stimuli: shuffledStimuli,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
