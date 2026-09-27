"use client";

import { useInView } from "@/lib/use-in-view";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Hero SVG orbit system — three concentric dashed rings with glowing
 * comet heads, centred on the name block.
 *
 * Perf contract (why this can't lag):
 *   · each ring is its OWN root <svg> rotated via CSS transform → the
 *     browser promotes every rotor to a GPU compositor layer. (Animating
 *     inner <g> elements instead forces a full-SVG CPU repaint every
 *     frame — that was the lag.)
 *   · zero JS per frame, zero filters, zero SMIL
 *   · IntersectionObserver pauses the spin the moment the hero scrolls out
 *   · prefers-reduced-motion renders the rings static
 */
export default function HeroOrbits() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "120px" });
  const reduced = usePrefersReducedMotion();
  const paused = !inView || reduced;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 ${
        paused ? "svg-paused" : ""
      }`}
    >
      {/* Sized square stage — one root <svg> per ring so each rotor gets
          its own compositor layer. Nothing inside ever animates. */}
      <div className="absolute right-[-34%] top-1/2 aspect-square w-[min(120vw,980px)] -translate-y-1/2 opacity-80 lg:right-[-16%] xl:right-[-8%]">
        {/* ── Ring 1 · r384 — sparse ticks, comet at 12 o'clock, 90s cw ── */}
        <svg
          viewBox="0 0 800 800"
          fill="none"
          className="orbit-spin absolute inset-0 size-full"
          style={{ animationDuration: "90s" }}
        >
          <circle cx="400" cy="400" r="384" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 14" />
          <circle
            cx="400" cy="400" r="384"
            stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"
            strokeDasharray="70 2343" strokeDashoffset="-1740" opacity="0.55"
          />
          <circle cx="400" cy="16" r="5.5" fill="var(--accent)" opacity="0.25" />
          <circle cx="400" cy="16" r="2.6" fill="var(--accent)" />
        </svg>

        {/* ── Ring 2 · r300 — reverse orbit, comet at 3 o'clock, 60s ccw ── */}
        <svg
          viewBox="0 0 800 800"
          fill="none"
          className="orbit-spin reverse absolute inset-0 size-full"
          style={{ animationDuration: "60s" }}
        >
          <circle cx="400" cy="400" r="300" stroke="var(--border)" strokeWidth="1" strokeDasharray="1 9" opacity="0.7" />
          <circle
            cx="400" cy="400" r="300"
            stroke="var(--accent2)" strokeWidth="1" strokeDasharray="240 1645"
            strokeDashoffset="-600" opacity="0.3"
          />
          <circle
            cx="400" cy="400" r="300"
            stroke="var(--accent2)" strokeWidth="1.4" strokeLinecap="round"
            strokeDasharray="70 1815" opacity="0.5"
          />
          <circle cx="700" cy="400" r="4.8" fill="var(--accent2)" opacity="0.25" />
          <circle cx="700" cy="400" r="2.2" fill="var(--accent2)" />
        </svg>

        {/* ── Ring 3 · r216 — comet at 7:30, 140s cw ── */}
        <svg
          viewBox="0 0 800 800"
          fill="none"
          className="orbit-spin absolute inset-0 size-full"
          style={{ animationDuration: "140s" }}
        >
          <circle cx="400" cy="400" r="216" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 6" opacity="0.8" />
          <circle
            cx="400" cy="400" r="216"
            stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"
            strokeDasharray="80 1277" strokeDashoffset="-429" opacity="0.5"
          />
          <circle cx="247.3" cy="552.7" r="4.6" fill="var(--accent)" opacity="0.25" />
          <circle cx="247.3" cy="552.7" r="2" fill="var(--accent)" />
        </svg>

        {/* ── Static star specks — no animation, zero cost ── */}
        <svg viewBox="0 0 800 800" fill="none" className="absolute inset-0 size-full">
          <circle cx="150" cy="180" r="1.4" fill="var(--accent)" opacity="0.4" />
          <circle cx="660" cy="130" r="1.1" fill="var(--fg)" opacity="0.3" />
          <circle cx="710" cy="600" r="1.4" fill="var(--accent)" opacity="0.35" />
          <circle cx="120" cy="560" r="1.1" fill="var(--fg)" opacity="0.25" />
          <circle cx="430" cy="90" r="1.2" fill="var(--accent2)" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}