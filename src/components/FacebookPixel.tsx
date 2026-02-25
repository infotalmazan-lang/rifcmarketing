"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useIsDevTraffic } from "@/hooks/useIsDevTraffic";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// Pages where pixel should NOT fire (admin/work areas)
const EXCLUDED_PATHS = [
  "/articolstiintific/sondaj",  // admin panel
  "/articolstiintific",          // article editor area
];

// Check if current path should be excluded
function isExcluded(pathname: string): boolean {
  // These sub-paths are ALLOWED (public-facing, need tracking)
  if (pathname === "/articolstiintific/sondaj/wizard") return false;
  if (pathname.startsWith("/articolstiintific/osf")) return false;
  // Everything else under /articolstiintific is excluded (admin areas)
  return EXCLUDED_PATHS.some(p => pathname.startsWith(p));
}

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

// ── Generate unique event_id for Meta deduplication ─────
// CRITICAL: Same event_id must be sent to BOTH browser Pixel AND server CAPI
// so Meta can deduplicate events instead of double-counting them.
function generateEventId(eventName: string): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 10);
  return `${eventName}_${ts}_${rand}`;
}

/**
 * Facebook Pixel — browser-side tracking
 * Active on: / (landing), /articolstiintific/sondaj/wizard (survey)
 * Excluded: /articolstiintific, /articolstiintific/sondaj (admin areas)
 * Excluded: dev IPs listed in EXCLUDED_IPS env var
 */
export default function FacebookPixel() {
  const pathname = usePathname();
  const { isDev, loading } = useIsDevTraffic();

  // Don't render pixel script on excluded pages or for dev traffic
  if (!FB_PIXEL_ID || isExcluded(pathname)) return null;
  if (loading || isDev) return null;

  return (
    <>
      <Script
        id="fb-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// ── Helper: fire browser-side FB event WITH eventID ─────
// fbq('track', eventName, params, { eventID }) enables deduplication
export function fbEvent(eventName: string, params?: Record<string, any>, eventId?: string) {
  if (typeof window !== "undefined" && window.fbq) {
    const opts = eventId ? { eventID: eventId } : undefined;
    window.fbq("track", eventName, params || {}, opts);
  }
}

// Custom events (not standard FB events) WITH eventID
export function fbCustomEvent(eventName: string, params?: Record<string, any>, eventId?: string) {
  if (typeof window !== "undefined" && window.fbq) {
    const opts = eventId ? { eventID: eventId } : undefined;
    window.fbq("trackCustom", eventName, params || {}, opts);
  }
}

// ── Read _fbc and _fbp cookies from client-side ──
// CRITICAL for Event Match Quality: browsers (Safari ITP, Firefox ETP) may
// block these cookies from being sent in server request headers, so we read
// them on the CLIENT and pass them explicitly in the POST body.
function getClientFbCookies(): { fbc?: string; fbp?: string } {
  if (typeof document === "undefined") return {};
  const cookies = document.cookie || "";
  const fbcMatch = cookies.match(/(?:^|;\s*)_fbc=([^;]*)/);
  const fbpMatch = cookies.match(/(?:^|;\s*)_fbp=([^;]*)/);
  const result: { fbc?: string; fbp?: string } = {};
  if (fbcMatch) result.fbc = fbcMatch[1];
  if (fbpMatch) result.fbp = fbpMatch[1];

  // If no _fbc cookie but fbclid is in URL, construct it manually
  // Format: fb.1.{timestamp}.{fbclid}
  if (!result.fbc && typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const fbclid = url.searchParams.get("fbclid");
    if (fbclid) {
      result.fbc = `fb.1.${Date.now()}.${fbclid}`;
    }
  }
  return result;
}

// ── Helper: fire event to CAPI (server-side) with shared event_id ──
export async function fbServerEvent(eventName: string, params?: Record<string, any>, eventId?: string) {
  try {
    const fbCookies = getClientFbCookies();
    await fetch("/api/fb-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventSourceUrl: window.location.href,
        eventId, // shared event_id for Meta deduplication
        // Pass fbc/fbp explicitly from client for better Event Match Quality
        clientFbc: fbCookies.fbc,
        clientFbp: fbCookies.fbp,
        ...params,
      }),
    });
  } catch {
    // Silent fail — don't break user experience
  }
}

// ── Combined: fire BOTH browser + server with SAME event_id ──
// This is the KEY fix for Meta deduplication — identical event_id on both sides
export function fbTrack(eventName: string, params?: Record<string, any>) {
  const eventId = generateEventId(eventName);
  fbEvent(eventName, params, eventId);
  fbServerEvent(eventName, params, eventId);
}

export function fbTrackCustom(eventName: string, params?: Record<string, any>) {
  const eventId = generateEventId(eventName);
  fbCustomEvent(eventName, params, eventId);
  fbServerEvent(eventName, { ...params, customEvent: true }, eventId);
}
