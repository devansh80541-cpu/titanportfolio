"use client";

import Magnetic from "@/components/cursor/Magnetic";
import { useInView } from "@/lib/use-in-view";

/** Status indicator badge — champagne dot & precision craftsmanship label. */
export default function AvailabilityBadge() {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <Magnetic force={0.25} className="inline-block">
      <span
        ref={ref}
        data-cursor="hover"
        className="theme-fade inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-muted backdrop-blur-sm transition-colors duration-200 hover:text-fg"
      >
        <span className="relative flex size-2">
          {inView && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          )}
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        Creative Engineering & Motion
      </span>
    </Magnetic>
  );
}
