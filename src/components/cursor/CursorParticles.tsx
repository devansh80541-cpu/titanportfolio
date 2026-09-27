"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Cursor particle field — Canvas2D, zero dependencies.
 *  · ember trail emitted along the pointer's path (distance-gated)
 *  · click shockwave: expanding ring + radial burst
 *  · listens for the "titan:confetti" CustomEvent (fired by PartyMode)
 *  · colors read from the design tokens, re-read on theme/party flips
 *
 * The rAF loop is self-sleeping: it renders only while particles or
 * shockwaves are alive, and pauses entirely when the tab is hidden.
 * Disabled for touch/coarse pointers and prefers-reduced-motion.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  drag: number;
}

interface Shockwave {
  x: number;
  y: number;
  r: number;
  alpha: number;
  color: string;
}

const MAX_PARTICLES = 30;
const CONFETTI_EVENT = "titan:confetti";

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    // desynchronized = lower-latency present hint; alpha keeps it overlay-only
    const g2d = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!g2d) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      g2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ── Palette — design tokens, re-read on theme / party-mode flips ──
    let accent = "#c5a880";
    let accent2 = "#b85b35";
    let lastRead = 0;
    const readPalette = (force = false) => {
      const now = performance.now();
      if (!force && now - lastRead < 1000) return;
      lastRead = now;
      const s = getComputedStyle(document.documentElement);
      const a = s.getPropertyValue("--accent").trim();
      const b = s.getPropertyValue("--accent2").trim();
      if (a) accent = a;
      if (b) accent2 = b;
    };
    readPalette(true);
    const observer = new MutationObserver(() => readPalette(true));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const isParty = () =>
      document.documentElement.classList.contains("party-mode");
    const pickColor = () => {
      if (isParty()) return `hsl(${Math.floor(Math.random() * 360)} 80% 64%)`;
      readPalette();
      return Math.random() > 0.75 ? accent2 : accent;
    };

    const particles: Particle[] = [];
    const waves: Shockwave[] = [];
    let raf = 0;
    let running = false;
    let lastX = -1;
    let lastY = -1;

    const spawn = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      life = 46 + Math.random() * 26,
      size = 0.9 + Math.random() * 1.9
    ) => {
      particles.push({
        x,
        y,
        vx,
        vy,
        life,
        maxLife: life,
        size,
        color: pickColor(),
        gravity: 0.045,
        drag: 0.985,
      });
      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }
    };

    const burst = (x: number, y: number, count: number, power: number) => {
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const s = power * (0.5 + Math.random() * 0.8);
        spawn(
          x,
          y,
          Math.cos(a) * s,
          Math.sin(a) * s,
          40 + Math.random() * 30,
          1 + Math.random() * 2.2
        );
      }
    };

    const confettiBurst = () => {
      const start = particles.length;
      for (let i = 0; i < 26; i++) {
        spawn(
          Math.random() * w,
          h * (0.15 + Math.random() * 0.4),
          (Math.random() - 0.5) * 4,
          -(2 + Math.random() * 5),
          70 + Math.random() * 50,
          1.4 + Math.random() * 2.2
        );
      }
      // confetti gets floatier physics than the ember trail
      for (let i = start; i < particles.length; i++) {
        particles[i].gravity = 0.075;
        particles[i].drag = 0.992;
      }
    };

    const tick = () => {
      g2d.clearRect(0, 0, w, h);

      // shockwave rings
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.r += wave.r * 0.14 + 2.4;
        wave.alpha *= 0.9;
        if (wave.alpha < 0.02) {
          waves.splice(i, 1);
          continue;
        }
        g2d.globalAlpha = wave.alpha;
        g2d.strokeStyle = wave.color;
        g2d.lineWidth = 2;
        g2d.beginPath();
        g2d.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
        g2d.stroke();
      }

      // particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        if (p.life <= 0 || p.y > h + 60 || p.x < -60 || p.x > w + 60) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.life / p.maxLife;
        g2d.globalAlpha = Math.min(1, t * 1.6);
        g2d.fillStyle = p.color;
        g2d.beginPath();
        g2d.arc(p.x, p.y, p.size * (0.45 + 0.55 * t), 0, Math.PI * 2);
        g2d.fill();
      }

      g2d.globalAlpha = 1;

      if (particles.length > 0 || waves.length > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false; // self-sleep — zero cost when idle
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: MouseEvent) => {
      if (lastX < 0) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const dist = Math.hypot(dx, dy);
      if (dist < 32) return; // idle decay — no spawn while pointer moves slowly
      const n = 1;
      for (let i = 0; i < n; i++) {
        spawn(
          e.clientX,
          e.clientY,
          -dx * 0.045 + (Math.random() - 0.5) * 0.7,
          -dy * 0.045 + (Math.random() - 0.5) * 0.7 - 0.25
        );
      }
      wake();
    };

    const onDown = (e: MouseEvent) => {
      waves.push({
        x: e.clientX,
        y: e.clientY,
        r: 3,
        alpha: 0.5,
        color: isParty()
          ? `hsl(${Math.floor(Math.random() * 360)} 80% 64%)`
          : accent,
      });
      burst(e.clientX, e.clientY, 4, 1.5);
      wake();
    };

    const onConfetti = () => {
      confettiBurst();
      wake();
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      } else if (particles.length > 0 || waves.length > 0) {
        wake();
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener(CONFETTI_EVENT, onConfetti);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener(CONFETTI_EVENT, onConfetti);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[96]"
    />
  );
}