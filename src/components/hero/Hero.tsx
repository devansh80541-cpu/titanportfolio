"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { ArrowDown } from "lucide-react";
import KineticText from "@/components/typography/KineticText";
import AvailabilityBadge from "@/components/hero/AvailabilityBadge";
import Magnetic from "@/components/cursor/Magnetic";
import HeroOrbits from "@/components/fx/HeroOrbits";
import AnimeSpeedLines from "@/components/fx/AnimeSpeedLines";
import AnimeEnergyPulse from "@/components/fx/AnimeEnergyPulse";
import AnimeDecoText from "@/components/fx/AnimeDecoText";
import { site } from "@/data/site";
import { scrollToId } from "@/lib/lenis";
import { gsap } from "@/lib/gsap";

import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";



/**
 * Kinetic landing — orchestrated GSAP timeline entrance:
 *   availability badge → TITAN kinetic text → role subtitle → tagline →
 *   CTAs → scroll nudge → 3D model entrance.
 * All elements coordinate via a single timeline that fires after the
 * preloader exits, producing a dramatic staggered reveal.
 */
export default function Hero() {
  const nudgeRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  // Wait for preloader to finish (sessionStorage flag or timeout)
  useEffect(() => {
    const check = () => {
      try {
        if (sessionStorage.getItem("titan-preloader-seen")) {
          setReady(true);
          return;
        }
      } catch {
        // storage blocked
      }
      // Hard fallback: ready after 2s max
      const timer = window.setTimeout(() => setReady(true), 2000);
      // Also listen for preloader exit
      const id = window.setInterval(() => {
        try {
          if (sessionStorage.getItem("titan-preloader-seen")) {
            setReady(true);
            window.clearInterval(id);
          }
        } catch {
          // ignore
        }
      }, 100);
      return () => {
        window.clearTimeout(timer);
        window.clearInterval(id);
      };
    };
    check();
  }, []);

  // Orchestrated entrance timeline
  useEffect(() => {
    if (reduced || !ready) return;
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Badge slides in from left
      tl.fromTo(
        "[data-hero-badge]",
        { opacity: 0, x: -30, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8 },
        0
      );

      // 2. Location text fades in
      tl.fromTo(
        "[data-hero-location]",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.15
      );

      // 3. Kinetic text for TITAN fires at 0.35s (handled by KineticText delay prop)
      // 4. Role subtitle at 0.55s (handled by KineticText delay prop)

      // 5. Tagline paragraph
      tl.fromTo(
        "[data-hero-tagline]",
        { opacity: 0, y: 24, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
        0.85
      );

      // 6. CTA buttons stagger
      tl.fromTo(
        "[data-hero-cta]",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1 },
        1.0
      );

      // 7. Bottom bar (portfolio year + scroll nudge)
      tl.fromTo(
        "[data-hero-bottom]",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
        1.2
      );



      // 9. Grid lines draw in
      tl.fromTo(
        "[data-hero-grid] > div",
        { scaleY: 0 },
        { scaleY: 1, duration: 1.2, stagger: 0.08, ease: "power2.inOut" },
        0.2
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, ready]);

  // Scroll nudge bounce
  useEffect(() => {
    if (reduced) return;
    const el = nudgeRef.current;
    if (!el) return;
    const tween = gsap.to(el, {
      y: 5,
      duration: 0.9,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [reduced]);

  return (
    <section
      id="top"
      ref={sectionRef}
      data-dissolve
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ambient champagne bloom — eased scroll parallax */}
      <div
        aria-hidden
        data-parallax="smooth"
        className="absolute -top-48 right-[-12%] size-[38rem] rounded-full opacity-[0.1]"
        style={
          {
            background: "radial-gradient(closest-side, var(--accent), transparent)",
            "--parallax": "18",
          } as CSSProperties
        }
      />
      {/* editorial hairline grid — now with draw-in animation */}
      <div
        aria-hidden
        data-hero-grid
        className="absolute inset-0 mx-6 hidden border-l border-line/60 md:mx-10 md:grid md:grid-cols-4 lg:mx-16"
      >
        <div className="origin-top border-l border-line/60" />
        <div className="origin-top border-l border-line/60" />
        <div className="origin-top border-l border-line/60" />
        <div className="origin-top border-l border-line/60" />
      </div>

      {/* Anime power-on scan sweep — fires once on hero entrance */}
      {ready && <div aria-hidden className="anime-hero-scan" />}


      {/* Scroll-linked exit drift — CSS scroll-driven animation */}
      <div
        data-drift
        className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-1 flex-col justify-center gap-10 px-6 pb-14 pt-32 md:px-10 md:pt-28 lg:px-16"
      >
        <div className="flex items-center justify-between gap-4">
          <div data-hero-badge style={{ opacity: ready ? undefined : 0 }} className="flex items-center gap-3">
            <AvailabilityBadge />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-surface/70 px-3 py-1 text-[11px] font-bold tracking-widest text-accent uppercase backdrop-blur-md">
              <span className="size-1 rounded-full bg-accent animate-pulse" />
              タイタン · 創世
            </span>
          </div>
          <p
            data-hero-location
            style={{ opacity: ready ? undefined : 0 }}
            className="hidden text-xs uppercase tracking-[0.18em] text-muted md:block"
          >
            {site.location} — {site.timezoneLabel}
          </p>
        </div>

        {/* Name + model wrapper — relative so the model can perch on the corner */}
        <div className="relative">
          {/* Decorative SVG orbit rings — transform-only, paused off-screen */}
          <HeroOrbits />
          {/* Anime deco kanji */}
          <AnimeDecoText word="戦" position="right" />
          <AnimeDecoText word="電" position="left" className="hidden lg:block" />
          {/* Anime speed lines — dramatic radiating reveal */}
          <AnimeSpeedLines active={ready} />

          {/* Japanese Katakana Subtitle */}
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            <span>⚡ TITAN FX</span>
            <span className="text-muted">/</span>
            <span>タイタン・システム</span>
          </div>

          {/* Text block — TITAN + role */}
          <h1 className="relative z-10 font-display font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
            <KineticText as="span" text={site.name} className="block text-hero" delay={ready ? 0.35 : 99} magneticWarp={true} />
            <KineticText
              as="span"
              text={site.role}
              className="mt-4 block text-section font-bold lowercase tracking-[-0.02em] text-muted md:mt-6"
              delay={ready ? 0.55 : 99}
              magneticWarp={true}
            />
          </h1>
          <p className="mt-3 text-xs tracking-wider text-muted font-medium">
            「 上級フロントエンドエンジニア & クリエイティブコーダー 」
          </p>
        </div>

        <p
          data-hero-tagline
          style={{ opacity: ready ? undefined : 0 }}
          className="max-w-xl text-body text-muted"
        >
          {site.tagline} Currently building physics-based interfaces for studios across
          Mumbai, Goa, and the Bay.
        </p>

        <div
          style={{ opacity: ready ? undefined : 0 }}
          className="flex flex-wrap items-center gap-6"
        >
          <div data-hero-cta>
            <Magnetic force={0.25}>
              <button
                data-cursor="hover"
                onClick={() => scrollToId("#works")}
                className="group anime-glow inline-flex items-center gap-3 rounded-full border border-line px-6 py-3.5 text-sm font-medium transition-all duration-200 hover:border-fg hover:bg-fg hover:text-bg hover:shadow-[0_4px_20px_rgba(197,168,128,0.15)] active:scale-[0.97]"
              >
                <span className="text-xs font-bold text-accent group-hover:text-bg transition-colors">[ 参上 ]</span>
                View selected work
                <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </button>
            </Magnetic>
          </div>
          <a
            data-hero-cta
            data-cursor="hover"
            href={`mailto:${site.email}`}
            className="link-underline text-sm text-muted transition-colors duration-200 hover:text-fg"
          >
            {site.email}
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1920px] items-end justify-between px-6 pb-8 md:px-10 lg:px-16">
        <p
          data-hero-bottom
          style={{ opacity: ready ? undefined : 0 }}
          className="text-xs uppercase tracking-[0.18em] text-muted"
        >
          Portfolio — {new Date().getFullYear()}
        </p>
        <button
          data-hero-bottom
          style={{ opacity: ready ? undefined : 0 }}
          data-cursor="hover"
          onClick={() => scrollToId("#works")}
          aria-label="Scroll to selected work"
          className="relative flex flex-col items-center gap-2 text-muted transition-colors duration-200 hover:text-fg"
        >
          <span className="text-[10px] uppercase tracking-[0.22em]">Scroll</span>
          <span className="theme-fade relative grid size-10 place-items-center rounded-full border border-line">
            {/* Anime energy pulse ring radiating from the nudge */}
            <AnimeEnergyPulse trigger={ready} interval={5000} size={40} />
            <span ref={nudgeRef} className="grid place-items-center">
              <ArrowDown className="size-4" />
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}
