import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const FB_ACCESS_TOKEN = process.env.FB_CAPI_ACCESS_TOKEN;
const FB_API_VERSION = "v21.0";

// Hash helper for user data (Meta requires SHA-256 lowercase hex)
function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * POST /api/fb-event — Facebook Conversions API (CAPI)
 * Sends server-side events to Meta for deduplication with browser Pixel
 */
export async function POST(request: Request) {
  if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, error: "FB credentials not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      eventName,
      eventSourceUrl,
      eventId,       // shared event_id from browser for deduplication
      customEvent,
      // Client-side fbc/fbp cookies (sent explicitly for better Event Match Quality)
      clientFbc,
      clientFbp,
      // Optional user data for matching
      email,
      phone,
      // Optional custom data
      ...customData
    } = body;

    if (!eventName) {
      return NextResponse.json({ ok: false, error: "eventName required" }, { status: 400 });
    }

    // Get IP and user agent from request headers for user matching
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "0.0.0.0";
    const userAgent = request.headers.get("user-agent") || "";

    // Skip sending to Meta if this is dev traffic (IP in EXCLUDED_IPS)
    const excludedRaw = process.env.EXCLUDED_IPS || "";
    const excludedIps = excludedRaw.split(",").map((i) => i.trim()).filter(Boolean);
    if (excludedIps.length > 0 && excludedIps.includes(ip)) {
      return NextResponse.json({ ok: true, skipped: "dev-ip" });
    }

    // Build user_data for matching
    const userData: Record<string, any> = {
      client_ip_address: ip,
      client_user_agent: userAgent,
    };

    // Add hashed PII if provided
    if (email) userData.em = [hash(email)];
    if (phone) userData.ph = [hash(phone)];

    // Read fbc and fbp — prefer client-provided values (more reliable),
    // fall back to server-side cookie headers
    const cookies = request.headers.get("cookie") || "";
    const fbcMatch = cookies.match(/(?:^|;\s*)_fbc=([^;]*)/);
    const fbpMatch = cookies.match(/(?:^|;\s*)_fbp=([^;]*)/);
    // Client-provided fbc/fbp take priority (Safari ITP / Firefox ETP may
    // strip cookies from fetch headers, but document.cookie still works)
    const fbc = clientFbc || (fbcMatch ? fbcMatch[1] : null);
    const fbp = clientFbp || (fbpMatch ? fbpMatch[1] : null);
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;

    // Build event
    const event: Record<string, any> = {
      event_name: customEvent ? eventName : eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: eventSourceUrl || "https://rifcmarketing.com",
      user_data: userData,
    };

    // Add custom_data if any relevant fields (exclude internal keys)
    const internalKeys = new Set(["customEvent", "eventId", "clientFbc", "clientFbp"]);
    const relevantCustom: Record<string, any> = {};
    for (const [key, val] of Object.entries(customData)) {
      if (val !== undefined && val !== null && !internalKeys.has(key)) {
        relevantCustom[key] = val;
      }
    }
    if (Object.keys(relevantCustom).length > 0) {
      event.custom_data = relevantCustom;
    }

    // Deduplication: use event_id from browser (shared between Pixel + CAPI)
    // This is CRITICAL — Meta uses event_id to match browser + server events
    // and count them as ONE event instead of TWO
    event.event_id = eventId || `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Send to Meta Conversions API
    const url = `https://graph.facebook.com/${FB_API_VERSION}/${FB_PIXEL_ID}/events`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [event],
        access_token: FB_ACCESS_TOKEN,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Meta API error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, events_received: result.events_received });
  } catch {
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
