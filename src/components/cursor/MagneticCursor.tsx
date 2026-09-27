"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Variant = "default" | "hover" | "view";

const SIZES: Record<Variant, number> = { default: 14, hover: 64, view: 88 };

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * Clean, crisp custom cursor with zero trail lag or spring wobble.
 * Placed cleanly on the page immediately on load.
 */
export default function MagneticCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(true);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Initialized at screen center so it's placed on the page immediately
  const mx = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const my = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  // Fast, responsive main cursor spring (no sluggish wobble)
  const x = useSpring(mx, { stiffness: 600, damping: 36, mass: 0.1 });
  const y = useSpring(my, { stiffness: 600, damping: 36, mass: 0.1 });

  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (reduced) return;

    setEnabled(true);
    setVisible(true);
    document.documentElement.classList.add("custom-cursor");

    // Center on current window dimensions on mount
    mx.set(window.innerWidth / 2);
    my.set(window.innerHeight / 2);

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(
        "[data-cursor]"
      ) as HTMLElement | null;
      if (target) {
        setVariant((target.dataset.cursor as Variant) || "hover");
        setLabel(target.dataset.cursorLabel ?? "");
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    const onDown = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev.slice(-2), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 500);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [mx, my, reduced]);

  if (!enabled || reduced) return null;

  return (
    <>
      {/* Click feedback ripple */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ opacity: 0.6, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            className="pointer-events-none fixed z-[99] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/60 bg-accent/10 p-5 mix-blend-screen"
          />
        ))}
      </AnimatePresence>

      {/* Main Cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x, y }}
      >
        <motion.div
          className={
            variant === "view"
              ? "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white mix-blend-difference shadow-lg shadow-accent/20"
              : variant === "hover"
                ? "-translate-x-1/2 -translate-y-1/2 rounded-full border border-white mix-blend-difference"
                : "-translate-x-1/2 -translate-y-1/2 rounded-full bg-fg shadow-sm shadow-accent/40"
          }
          animate={{
            width: SIZES[variant],
            height: SIZES[variant],
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        >
          <AnimatePresence>
            {variant === "view" && label ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="select-none px-3 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-black"
              >
                {label}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
