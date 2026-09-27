"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Anime energy pulse — a ring that expands outward from a point,
 * like a power-up charge. Fires on a trigger, auto-repeats at a
 * loose interval. Zero per-frame cost.
 */
export default function AnimeEnergyPulse({
  trigger,
  interval = 4000,
  size = 80,
}: {
  trigger?: boolean;
  interval?: number;
  size?: number;
}) {
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ringRef.current;
    if (!el) return;

    const fire = () => {
      setActive(false); // reset
      requestAnimationFrame(() => {
        setActive(true);
        setTimeout(() => setActive(false), 2200);
      });
    };

    // Fire on mount + trigger change
    const first = setTimeout(fire, 800);
    const loop = trigger ? setInterval(fire, interval) : null;

    return () => {
      clearTimeout(first);
      if (loop) clearInterval(loop);
    };
  }, [reduced, trigger, interval]);

  if (reduced) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden
      className={`anime-energy-pulse ${active ? "active" : ""}`}
      style={{ width: size, height: size }}
    />
  );
}
