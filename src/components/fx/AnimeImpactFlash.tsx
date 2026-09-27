"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Anime "impact frame" — a full-screen white flash with a faint
 * chromatic split. Fires once on mount (after the preloader) and
 * on the Selected Works + About transitions. Debounced so it never
 * stacks. Purely decorative, pointer-events: none.
 */
export default function AnimeImpactFlash() {
  const flashRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = flashRef.current;
    if (!el) return;

    // Initial entrance flash after preloader
    const t1 = setTimeout(() => {
      el.classList.add("active");
      setTimeout(() => el.classList.remove("active"), 600);
    }, 1600);

    return () => {
      clearTimeout(t1);
    };
  }, [reduced]);

  return <div ref={flashRef} aria-hidden className="anime-impact-flash" />;
}
