"use client";

import { useInView } from "@/lib/use-in-view";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/* One seamless period per path — tiles perfectly when the pair of copies
   inside each <g> is translated by -1440 user units and looped. */
const WAVE_A =
  "M0 62 C120 22 240 22 360 62 S600 102 720 62 S960 22 1080 62 S1320 102 1440 62";
const WAVE_B =
  "M0 70 C120 108 240 108 360 70 S600 34 720 70 S960 106 1080 70 S1320 34 1440 70";

/**
 * Footer SVG wave — two tiled sine layers drifting in opposite directions.
 *
 * Perf contract:
 *   · loops animate ONLY `transform: translateX` on SVG groups (GPU)
 *   · the whole SVG unmounts while the footer is off-screen
 *   · prefers-reduced-motion renders a static pair of waves
 *   · vector-effect keeps strokes hairline-thin at any container size
 */
export default function FooterWave() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "80px" });
  const reduced = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-20 overflow-hidden md:h-28"
    >
      {inView && (
        <>
          {/* Layer 1 — champagne gradient, slow leftward drift.
              The animation lives on the ROOT svg → compositor layer. */}
          <svg
            viewBox="0 0 2880 120"
            preserveAspectRatio="none"
            fill="none"
            className={`absolute bottom-0 left-0 h-full w-[200%] ${reduced ? "" : "wave-drift"}`}
            style={reduced ? undefined : { animationDuration: "30s" }}
          >
            <defs>
              <linearGradient
                id="titan-wave-grad"
                x1="0" y1="0" x2="2880" y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
                <stop offset="0.35" stopColor="var(--accent)" stopOpacity="0.4" />
                <stop offset="0.65" stopColor="var(--accent)" stopOpacity="0.4" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={WAVE_A} stroke="url(#titan-wave-grad)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <path d={WAVE_A} stroke="url(#titan-wave-grad)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" transform="translate(1440)" />
          </svg>

          {/* Layer 2 — terracotta counter-drift, its own root svg/layer */}
          <svg
            viewBox="0 0 2880 120"
            preserveAspectRatio="none"
            fill="none"
            className={`absolute bottom-0 left-0 h-full w-[200%] ${reduced ? "" : "wave-drift reverse"}`}
            style={reduced ? undefined : { animationDuration: "19s", opacity: 0.55 }}
          >
            <path d={WAVE_B} stroke="var(--accent2)" strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" />
            <path d={WAVE_B} stroke="var(--accent2)" strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" transform="translate(1440)" />
          </svg>
        </>
      )}
    </div>
  );
}