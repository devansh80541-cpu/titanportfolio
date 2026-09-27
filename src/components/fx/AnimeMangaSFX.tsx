"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const SFX_WORDS = [
  "ゴゴゴ", "ドドド", "バーン!", "シュッ!",
  "キラッ✨", "ドーン!", "ズキュン!", "閃光!",
  "無敵!", "タイタン!", "TITAN!", "勝負!",
  "覚醒!", "参上!", "斬!", "技!",
  "POW!", "ZAP!", "STRIKE!", "BOOM!",
];

interface Stamp {
  id: number;
  word: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

const COLORS = [
  "var(--accent)",   // champagne
  "var(--accent2)",  // terracotta
  "var(--fg)",       // ivory
];

let _id = 0;

/**
 * Manga-style onomatopoeia stamps that burst at the cursor
 * on every click. Pure CSS animation — zero scroll jank.
 * Uses the site's original champagne / terracotta palette.
 */
export default function AnimeMangaSFX() {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef(false);

  const spawnStamp = useCallback((x: number, y: number) => {
    if (cooldownRef.current || !containerRef.current) return;
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 350);

    const stamp: Stamp = {
      id: ++_id,
      word: SFX_WORDS[Math.floor(Math.random() * SFX_WORDS.length)],
      x,
      y,
      rotation: (Math.random() - 0.5) * 28,
      scale: 0.8 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    const el = document.createElement("span");
    el.className = "anime-sfx-stamp";
    el.textContent = stamp.word;
    el.style.cssText = `
      left: ${stamp.x}px;
      top: ${stamp.y}px;
      --sfx-rot: ${stamp.rotation}deg;
      --sfx-scale: ${stamp.scale};
      color: ${stamp.color};
    `;
    containerRef.current.appendChild(el);

    // Remove after animation (~900ms)
    setTimeout(() => {
      el.remove();
    }, 900);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const handleClick = (e: MouseEvent) => {
      // Don't stamp on interactive elements
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [data-no-sfx]")) return;
      spawnStamp(e.clientX, e.clientY);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [reduced, spawnStamp]);

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    />
  );
}
