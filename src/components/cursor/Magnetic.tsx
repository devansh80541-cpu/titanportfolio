"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MAGNETIC_SPRING } from "@/lib/utils";
import { play } from "@/lib/sound";

/**
 * Magnetic attraction: ΔX = (cursor − element center) × force.
 * Springs back to origin on leave. Also fires the synth hover/press
 * sounds for the site-wide sonic UI (silent no-ops when muted/unlocked).
 */
export default function Magnetic({
  children,
  className,
  force = 0.35,
}: {
  children: ReactNode;
  className?: string;
  force?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, MAGNETIC_SPRING);
  const y = useSpring(my, MAGNETIC_SPRING);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * force);
    my.set((e.clientY - (rect.top + rect.height / 2)) * force);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseEnter={() => play("hover")}
      onPointerDown={() => play("press")}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
