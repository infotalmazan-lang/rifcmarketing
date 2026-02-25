import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/check-dev — checks if the visitor's IP is in the excluded list
 * Used by GA4 and FB Pixel to skip tracking for dev traffic
 */
export async function GET(request: Request) {
  const excludedRaw = process.env.EXCLUDED_IPS || "";
  const excludedIps = excludedRaw
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";

  const isDev = excludedIps.length > 0 && excludedIps.includes(ip);

  return NextResponse.json({ isDev, ip });
}
