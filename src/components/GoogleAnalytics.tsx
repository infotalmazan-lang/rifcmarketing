"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useIsDevTraffic } from "@/hooks/useIsDevTraffic";

const GA_MEASUREMENT_ID = "G-DSRWLHHWHY";

// Pages where GA should NOT fire (admin/work areas)
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
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Google Analytics 4 — browser-side tracking
 * Active on: / (landing), /articolstiintific/sondaj/wizard (survey)
 * Excluded: /articolstiintific, /articolstiintific/sondaj (admin areas)
 * Excluded: dev IPs listed in EXCLUDED_IPS env var
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const { isDev, loading } = useIsDevTraffic();

  // Don't render GA script on excluded pages or for dev traffic
  if (isExcluded(pathname)) return null;
  if (loading || isDev) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
