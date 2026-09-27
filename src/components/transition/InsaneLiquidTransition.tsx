"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Clean, high-performance page transition:
 * Replaces heavy SVG turbulence, liquid scale wobble, and light sweeps
 * with a fast, seamless dark curtain fade (zero white flicker, zero distortion).
 */
export default function InsaneLiquidTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 350);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Fast, seamless dark overlay transition (prevents white/light flicker) */}
      <AnimatePresence mode="wait">
        {animating && (
          <motion.div
            key="page-curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="pointer-events-none fixed inset-0 z-[999] bg-[#0F1012]"
          />
        )}
      </AnimatePresence>

      {/* Main Page Content — crisp opacity fade without wobble or scale blur */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full bg-[#0F1012]"
      >
        {children}
      </motion.div>
    </>
  );
}
