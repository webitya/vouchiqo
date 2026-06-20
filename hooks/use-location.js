"use client";

import { useCallback, useEffect, useState } from "react";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

/**
 * Detects the user's city via browser geolocation + OpenStreetMap reverse geocoding.
 * Falls back gracefully if permission is denied or geolocation is unavailable.
 *
 * Returns:
 *  - city        string | null  — detected city name, null while pending or denied
 *  - status      "idle" | "detecting" | "ready" | "denied" | "unavailable"
 *  - detect()    function       — trigger detection manually
 *  - setCity()   function       — allow manual city override
 */
export function useLocation() {
  const [city, setCity] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | detecting | ready | denied | unavailable

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    setStatus("detecting");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `${NOMINATIM_URL}?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
            { headers: { "Accept-Language": "en" } },
          );
          if (!res.ok) throw new Error("Reverse geocode failed");

          const data = await res.json();
          const detected =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            null;

          setCity(detected);
          setStatus(detected ? "ready" : "unavailable");
        } catch {
          setStatus("unavailable");
        }
      },
      () => {
        // User denied or timed out
        setStatus("denied");
      },
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }, // cache position 5 min
    );
  }, []);

  // Auto-detect on mount (silent — no prompt until called)
  useEffect(() => {
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then(({ state }) => {
        // Only auto-detect if already granted — never auto-prompt
        if (state === "granted") detect();
      })
      .catch(() => {}); // permissions API not available in all browsers
  }, [detect]);

  return { city, setCity, status, detect };
}
