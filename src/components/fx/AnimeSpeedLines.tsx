"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const NUM_LINES = 24;

/**
 * Anime-style speed lines — radiating lines that fire outward
 * from center during the hero entrance. Pure CSS animation,
 * zero JS per frame. Each line has a randomised angle and delay.
 */
export default function AnimeSpeedLines({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (active && !reduced && !fired) {
      // Small delay so it syncs with the kinetic text reveal
      const t = setTimeout(() => setFired(true), 600);
      return () => clearTimeout(t);
    }
  }, [active, reduced, fired]);

  const lines = useMemo(
    () =>
      Array.from({ length: NUM_LINES }, (_, i) => {
        const angle = (360 / NUM_LINES) * i + (Math.random() * 6 - 3);
        const length = 120 + Math.random() * 280;
        const delay = Math.random() * 0.4;
        const width = 1 + Math.random() * 1.5;
        return { angle, length, delay, width };
      }),
    []
  );

  if (reduced) return null;

  return (
    <div className={`anime-speed-lines ${fired ? "active" : ""}`} aria-hidden>
      {lines.map((l, i) => (
        <div
          key={i}
          className="anime-speed-lines__line"
          style={
            {
              "--sl-angle": `${l.angle}deg`,
              width: `${l.length}px`,
              height: `${l.width}px`,
              animationDelay: `${l.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
