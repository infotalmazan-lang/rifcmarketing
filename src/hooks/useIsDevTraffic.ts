"use client";

import { useState, useEffect } from "react";

const CACHE_KEY = "rifc-dev-traffic";

/**
 * Hook that checks if the current visitor is dev traffic (IP in EXCLUDED_IPS).
 * Calls /api/check-dev once per session, caches result in sessionStorage.
 * Returns: { isDev: boolean | null, loading: boolean }
 *   - null = still checking
 *   - true = dev IP, skip tracking
 *   - false = normal visitor, track normally
 */
export function useIsDevTraffic() {
  const [isDev, setIsDev] = useState<boolean | null>(null);

  useEffect(() => {
    // Check sessionStorage cache first
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached !== null) {
      setIsDev(cached === "true");
      return;
    }

    fetch("/api/check-dev")
      .then((r) => r.json())
      .then((data) => {
        const val = !!data.isDev;
        sessionStorage.setItem(CACHE_KEY, String(val));
        setIsDev(val);
      })
      .catch(() => {
        // On error, allow tracking (don't block real users)
        setIsDev(false);
      });
  }, []);

  return { isDev, loading: isDev === null };
}
