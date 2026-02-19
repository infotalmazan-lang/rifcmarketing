"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

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

/**
 * Facebook Pixel — browser-side tracking
 * Active on: / (landing), /articolstiintific/sondaj/wizard (survey)
 * Excluded: /articolstiintific, /articolstiintific/sondaj (admin areas)
 */
export default function FacebookPixel() {
  const pathname = usePathname();

  // Don't render pixel script on excluded pages
  if (!FB_PIXEL_ID || isExcluded(pathname)) return null;

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

// ── Helper: fire browser-side FB events ──────────────────
export function fbEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.fbq) {
    if (params) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }
  }
}

// Custom events (not standard FB events)
export function fbCustomEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.fbq) {
    if (params) {
      window.fbq("trackCustom", eventName, params);
    } else {
      window.fbq("trackCustom", eventName);
    }
  }
}

// ── Helper: fire event to CAPI (server-side) too ─────────
export async function fbServerEvent(eventName: string, params?: Record<string, any>) {
  try {
    await fetch("/api/fb-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventSourceUrl: window.location.href,
        ...params,
      }),
    });
  } catch {
    // Silent fail — don't break user experience
  }
}

// ── Combined: fire both browser + server event ───────────
export function fbTrack(eventName: string, params?: Record<string, any>) {
  fbEvent(eventName, params);
  fbServerEvent(eventName, params);
}

export function fbTrackCustom(eventName: string, params?: Record<string, any>) {
  fbCustomEvent(eventName, params);
  fbServerEvent(eventName, { ...params, customEvent: true });
}
