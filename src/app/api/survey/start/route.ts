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

// Group stimuli by category (type), shuffle category order, shuffle within each category
function shuffleByCategoryGroups<T extends { type: string }>(items: T[]): T[] {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
  }
  const categoryKeys = shuffleArray(Object.keys(groups));
  return categoryKeys.flatMap(key => shuffleArray(groups[key]));
}

export async function POST(request: Request) {
  try {
    const supabase = createServiceRole();
    const sessionId = randomUUID();
    const ip = getClientIp(request);
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    const ua = request.headers.get("user-agent") || "";
    const deviceType = detectDevice(ua);

    // Parse optional distribution tag + locale + fingerprint from body
    let distributionId: string | null = null;
    let locale: string = "ro";
    let isPreview = false;
    let fingerprint: string | null = null;
    try {
      const body = await request.json();
      if (body?.locale) locale = String(body.locale).slice(0, 5);
      if (body?.preview) isPreview = true;
      if (body?.fingerprint) fingerprint = String(body.fingerprint).slice(0, 64);
      if (body?.tag) {
        const { data: dist } = await supabase
          .from("survey_distributions")
          .select("id")
          .eq("tag", body.tag)
          .single();
        if (dist) distributionId = dist.id;
      }
    } catch {
      // No body or invalid JSON — that's fine, tag is optional
    }

    // In preview mode, skip respondent creation — just return stimuli
    if (!isPreview) {
      // Create respondent (ip_address may not exist if migration 016 not run yet)
      const insertData: Record<string, unknown> = {
        session_id: sessionId,
        step_completed: 0,
        ip_hash: ipHash,
        ip_address: ip,
        user_agent: ua.slice(0, 255),
        device_type: deviceType,
        locale,
        ...(fingerprint ? { browser_fingerprint: fingerprint } : {}),
        ...(distributionId ? { distribution_id: distributionId } : {}),
      };

      let { error: respError } = await supabase
        .from("survey_respondents")
        .insert(insertData);

      // Fallback: if new columns don't exist yet, retry without them
      if (respError && (respError.message?.includes("ip_address") || respError.message?.includes("browser_fingerprint"))) {
        delete insertData.ip_address;
        delete insertData.browser_fingerprint;
        const retry = await supabase.from("survey_respondents").insert(insertData);
        respError = retry.error;
      }

      if (respError) {
        return NextResponse.json(
          { error: "Failed to start survey" },
          { status: 500 }
        );
      }
    }

    // Fetch active stimuli
    const { data: stimuli, error: stimError } = await supabase
      .from("survey_stimuli")
      .select("id, name, type, industry, description, image_url, video_url, audio_url, text_content, pdf_url, site_url, display_order")
      .eq("is_active", true)
      .order("display_order");

    if (stimError) {
      return NextResponse.json(
        { error: "Failed to load stimuli" },
        { status: 500 }
      );
    }

    // Group by category, randomize category order + within each category
    const shuffledStimuli = shuffleByCategoryGroups(stimuli || []);

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
