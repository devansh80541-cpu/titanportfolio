"use client";

import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useInView } from "@/lib/use-in-view";

/**
 * Oversized vertical Japanese characters floated in section
 * backgrounds. Purely decorative, zero-perf-footprint (static).
 */
export default function AnimeDecoText({
  word = "技",
  position = "right",
  className = "",
}: {
  word?: string;
  position?: "left" | "right";
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 ${position === "right" ? "right-6" : "left-6"} flex items-center opacity-0 transition-opacity duration-1000 ${
        inView ? "opacity-100" : ""
      } ${reduced ? "hidden" : ""} ${className}`}
    >
      <span className="anime-deco-text">{word}</span>
    </div>
  );
}
