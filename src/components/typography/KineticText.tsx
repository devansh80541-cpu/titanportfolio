"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type TagName = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type KineticTextProps = {
  text: string;
  as?: TagName;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  mode?: "load" | "scroll";
  /** Opt-in to cursor proximity magnetic warp distortion (defaults to false) */
  magneticWarp?: boolean;
};

/**
 * Clip-mask kinetic type with optional interactive character magnetic warp physics.
 * Each character translates along Y on entrance, and optionally stretches/tilts
 * towards the cursor when magneticWarp={true}.
 */
export default function KineticText({
  text,
  as = "div",
  className,
  delay = 0,
  stagger = 0.03,
  duration = 1.4,
  mode = "load",
  magneticWarp = false,
}: KineticTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Entrance animation
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-char]");
    if (chars.length === 0) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(chars, { yPercent: 0 });
        return;
      }
      gsap.set(chars, { yPercent: 120 });
      gsap.to(chars, {
        yPercent: 0,
        duration,
        ease: "power4.out",
        stagger,
        delay,
        ...(mode === "scroll"
          ? {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            }
          : {}),
      });
    }, el);

    return () => ctx.revert();
  }, [text, mode, delay, stagger, duration, reduced]);

  // Magnetic proximity warp physics — only active if magneticWarp === true
  useEffect(() => {
    const el = ref.current;
    if (!el || !magneticWarp || reduced) return;

    const chars = el.querySelectorAll<HTMLElement>("[data-char]");
    if (chars.length === 0) return;

    const handleMouseMove = (e: MouseEvent) => {
      const radius = 100;

      chars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const dx = e.clientX - charX;
        const dy = e.clientY - charY;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          const power = (1 - dist / radius);
          const moveX = (dx / dist) * power * 18;
          const moveY = (dy / dist) * power * 18;
          const rot = (dx / dist) * power * 22;
          const scale = 1 + power * 0.3;

          gsap.to(char, {
            x: moveX,
            y: moveY,
            rotation: rot,
            scale,
            color: "#FFFFFF",
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(char, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            color: "",
            duration: 0.5,
            ease: "elastic.out(1.2, 0.4)",
            overwrite: "auto",
          });
        }
      });
    };

    const handleMouseLeave = () => {
      chars.forEach((char) => {
        gsap.to(char, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          color: "",
          duration: 0.6,
          ease: "elastic.out(1.2, 0.4)",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [magneticWarp, reduced]);

  const Tag = as as "div";
  const words = text.split(" ");

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span
          key={`${word}-${wi}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
        >
          {Array.from(word).map((ch, ci) => (
            <span key={ci} data-char className="inline-block will-change-transform">
              {ch}
            </span>
          ))}
          {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}
