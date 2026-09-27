"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Magnetic from "@/components/cursor/Magnetic";

const BOOT = "SIGNAL LOST :: 404 — rerouting to nearest safe node…";

export default function NotFound() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(BOOT);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setTyped(BOOT.slice(0, i));
      if (i >= BOOT.length) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main
      id="main"
      className="crt relative flex min-h-[100svh] w-full flex-col items-start justify-center gap-6 overflow-hidden px-6 md:px-10 lg:px-16"
    >
      {/* Ghosted 404 stamp */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, rotate: -18, scale: 1.1 }}
        animate={{ opacity: 0.07, rotate: -12, scale: 1 }}
        transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -right-6 top-10 select-none font-display text-[24vw] font-extrabold uppercase leading-none text-fg md:top-4"
      >
        404
      </motion.span>

      <p className="relative z-[2] font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Error 404 — off the grid
      </p>

      <h1 className="relative z-[2] text-section font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
        Page not found
      </h1>

      <p className="relative z-[2] max-w-md font-mono text-sm leading-relaxed text-accent2">
        {typed}
        <span className="terminal-cursor" aria-hidden />
      </p>

      <p className="relative z-[2] max-w-md text-body text-muted">
        {
          "The page you're looking for was moved, renamed, or never existed — let's get you back to the work."
        }
      </p>

      <div className="relative z-[2] flex flex-wrap items-center gap-4">
        <Magnetic force={0.25}>
          <Link
            href="/"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 rounded-full border border-line px-6 py-3.5 text-sm font-medium transition duration-200 hover:border-fg hover:bg-fg hover:text-bg active:scale-[0.97]"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Teleport home
          </Link>
        </Magnetic>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {"hint: press ` on any page for the terminal"}
        </span>
      </div>
    </main>
  );
}
