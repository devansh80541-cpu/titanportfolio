"use client";

import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Champagne / terracotta palette — never pink/neon
const PETAL_COLORS = ["var(--accent)", "var(--accent2)", "var(--fg)"];

/**
 * Floating delicate petal motes that drift upward and sway gently.
 * Styled exclusively in the site's champagne / terracotta palette.
 */
export default function AnimePetals({
  count = 6,
  fixed = false,
}: {
  count?: number;
  fixed?: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const size = 5 + Math.random() * 9;
        const left = Math.random() * 100;
        const delay = Math.random() * 12;
        const dur = 9 + Math.random() * 9;
        const dx = (Math.random() - 0.5) * 120;
        const dy = 600 + Math.random() * 700;
        const rot = (Math.random() - 0.5) * 720;
        const opacity = 0.18 + Math.random() * 0.28;
        const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        return { size, left, delay, dur, dx, dy, rot, opacity, color };
      }),
    [count]
  );

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${fixed ? "fixed inset-0 z-[15]" : "absolute inset-0"} overflow-hidden`}
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="anime-petal"
          style={
            {
              left: `${p.left}%`,
              top: "100%",
              "--petal-size": `${p.size}px`,
              "--petal-dur": `${p.dur}s`,
              "--petal-delay": `${p.delay}s`,
              "--petal-dx": `${p.dx}px`,
              "--petal-dy": `-${p.dy}px`,
              "--petal-rot": `${p.rot}deg`,
              "--accent": p.color, // override accent locally per petal
              opacity: p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
