"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/lib/use-in-view";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const JA_LABELS: Record<string, string> = {
  "Selected Work": "主な実績",
  "About & Skills": "概要と技術",
  "Experience & History": "経歴と履歴",
  "Get In Touch": "お問い合わせ",
};

export default function SectionDivider({ label }: { label?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const gid = useId().replace(/:/g, "");

  return (
    <div ref={ref} aria-hidden className="relative my-8 flex w-full items-center justify-center overflow-hidden py-4">
      {/* Background Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-px w-full origin-center bg-gradient-to-r from-transparent via-line to-transparent"
      />

      {/* Comet sweeping along the divider — SVG, transform-only loop.
          Fully unmounted when off-screen or under reduced motion. */}
      {inView && !reduced && (
        <svg
          className="divider-comet pointer-events-none absolute inset-x-0 top-[calc(50%-4px)] h-2 w-full overflow-visible"
          fill="none"
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="110" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="0" y1="4" x2="110" y2="4" stroke={`url(#${gid})`} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="114" cy="4" r="2" fill="var(--accent)" />
        </svg>
      )}

      {/* Glowing Center Node & Label */}
      {label ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute flex items-center gap-2 rounded-full border border-line bg-bg/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted backdrop-blur-md"
        >
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span>{label}</span>
          {JA_LABELS[label] && (
            <span className="text-accent font-medium font-mono text-[9px] opacity-80">
              · {JA_LABELS[label]}
            </span>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute size-2 rounded-full bg-accent shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        />
      )}
    </div>
  );
}
