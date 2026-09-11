"use client";

import { useState, useEffect } from "react";

export default function useMediaQuery(query) {
  // Initialize synchronously from matchMedia where possible so the first
  // client render already reflects the real viewport (avoids painting the
  // desktop layout on phones before hydration flips it).
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    function handler(e) {
      setMatches(e.matches);
    }
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
