"use client";

import { useState, useEffect, useCallback } from "react";

const CACHE_KEY = "qraft-pricing-locale";
const TTL_MS = 24 * 60 * 60 * 1000;
const FALLBACK = { countryCode: "KE", currencyCode: "KES", rate: 1 };

const SHILLING_PREFIX = {
  KES: "KSh",
  UGX: "USh",
  TZS: "TSh",
};

export default function usePricing() {
  const [locale, setLocale] = useState(FALLBACK);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function detect() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Date.now() - parsed.ts < TTL_MS) {
            if (!cancelled) {
              setLocale(parsed);
              setReady(true);
            }
            return;
          }
        }
      } catch {
        // ignore corrupted cache
      }

      setReady(true);

      try {
        const res = await fetch("https://ipwho.is/");
        const geo = await res.json();
        if (!geo?.success || !geo?.currency?.code) throw new Error("geolocation lookup failed");

        const countryCode = geo.country_code || "KE";
        const currencyCode = geo.currency.code;

        let rate = 1;
        if (currencyCode !== "KES") {
          try {
            const ratesRes = await fetch("https://open.er-api.com/v6/latest/KES");
            const ratesData = await ratesRes.json();
            rate = ratesData?.rates?.[currencyCode] || 1;
          } catch {
            rate = 1;
          }
        }

        const next = { countryCode, currencyCode, rate, ts: Date.now() };
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          // cache is best-effort
        }

        if (!cancelled) setLocale(next);
      } catch {
        if (!cancelled) setLocale(FALLBACK);
      }
    }

    detect();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatPrice = useCallback(
    (amount) => {
      const { countryCode, currencyCode, rate } = locale;
      const value = Math.round(amount * rate * 100) / 100;

      if (SHILLING_PREFIX[currencyCode]) {
        const region =
          currencyCode === "KES" ? "KE" : currencyCode === "UGX" ? "UG" : "TZ";
        const digits = new Intl.NumberFormat(`en-${region}`, {
          maximumFractionDigits: 0,
        }).format(value);
        return `${SHILLING_PREFIX[currencyCode]} ${digits}`;
      }

      try {
        return new Intl.NumberFormat(`en-${countryCode}`, {
          style: "currency",
          currency: currencyCode,
          maximumFractionDigits: value % 1 ? 2 : 0,
        }).format(value);
      } catch {
        try {
          return new Intl.NumberFormat("en", {
            style: "currency",
            currency: currencyCode,
            maximumFractionDigits: 0,
          }).format(value);
        } catch {
          return `${currencyCode} ${value}`;
        }
      }
    },
    [locale]
  );

  return { formatPrice, ready, currency: locale.currencyCode };
}