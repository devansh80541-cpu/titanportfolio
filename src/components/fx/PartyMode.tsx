"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, Undo2 } from "lucide-react";
import { play } from "@/lib/sound";

const CODE = "party";
const CONFETTI_EVENT = "titan:confetti";

/**
 * Crazy mode — type P-A-R-T-Y anywhere (outside form fields) and:
 *   · the whole palette cycles through the rainbow (registered
 *     custom-property animation — see party-cycle in globals.css)
 *   · the particle field erupts confetti on a "titan:confetti" bus
 *   · a synth arpeggio plays
 * The toast doubles as the "return to form" escape hatch; Esc also exits.
 */
export default function PartyMode() {
  const [active, setActive] = useState(false);
  const bufferRef = useRef("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") {
        setActive(false);
        return;
      }
      if (e.key.length !== 1) return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(
        -CODE.length
      );
      if (bufferRef.current === CODE) {
        bufferRef.current = "";
        setActive((a) => !a);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.classList.add("party-mode");
    play("party");
    window.dispatchEvent(new CustomEvent(CONFETTI_EVENT));
    const id = window.setInterval(() => {
      window.dispatchEvent(new CustomEvent(CONFETTI_EVENT));
    }, 2400);
    return () => {
      window.clearInterval(id);
      root.classList.remove("party-mode");
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed bottom-6 left-0 right-0 z-[97] mx-auto w-fit"
        >
          <div className="flex items-center gap-3 rounded-full border border-accent/60 bg-bg/90 px-5 py-3 shadow-2xl shadow-accent/10 backdrop-blur-md">
            <PartyPopper className="size-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-fg">
              Crazy mode engaged
            </span>
            <button
              onClick={() => setActive(false)}
              data-cursor="hover"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-200 hover:border-accent hover:text-fg active:scale-95"
            >
              <Undo2 className="size-3" />
              Return to form
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}