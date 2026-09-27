"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Building2 } from "lucide-react";
import KineticText from "@/components/typography/KineticText";
import AnimeDecoText from "@/components/fx/AnimeDecoText";
import AnimePetals from "@/components/fx/AnimePetals";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { EASE_EXPO } from "@/lib/utils";
import { play } from "@/lib/sound";
import { site } from "@/data/site";
import { projects } from "@/data/projects";


const STATS = [
  { value: site.yearsExp, suffix: "", label: "Years of Practice" },
  { value: projects.length, suffix: "", label: "Featured Case Studies" },
  { value: site.skills.length, suffix: "+", label: "Skills in Rotation" },
];

/** Manga onomatopoeia that pops over the track on every slide. */
const SLIDE_SFX = [
  "シュッ!", "ドーン!", "ズキュン!", "ゴゴゴ", "参上!",
  "覚醒!", "斬!", "TITAN!", "ビュン!",
];
const SLIDE_SFX_COLORS = ["var(--accent)", "var(--accent2)", "var(--fg)"];

interface Streak {
  id: number;
  top: number;
  height: number;
  delay: number;
  reverse: boolean;
  alt: boolean;
}

let fxId = 0;

/**
 * Recreated Experience Timeline — "Four Years in Motion"
 * Fluid horizontal milestone carousel with interactive year stepper,
 * kinetic stats counters, smooth swipe/scroll navigation, and zero
 * pin-spacer black voids.
 */
export default function ExperienceTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const fxLayerRef = useRef<HTMLDivElement>(null);
  const shakeBoxRef = useRef<HTMLDivElement>(null);
  const streakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduced = usePrefersReducedMotion();

  const totalItems = site.timeline.length + 1; // Milestones + Stats panel

  useEffect(() => {
    return () => {
      if (streakTimer.current) clearTimeout(streakTimer.current);
    };
  }, []);

  /** Burst directional anime speed-streaks across the track. */
  const fireStreaks = useCallback(
    (direction: number) => {
      if (reduced) return;
      const next: Streak[] = Array.from({ length: 9 }, (_, i) => ({
        id: ++fxId,
        top: 4 + Math.random() * 88,
        height: Math.random() > 0.65 ? 2 : 1,
        delay: i * 0.025 + Math.random() * 0.1,
        reverse: direction < 0,
        alt: i % 3 === 2,
      }));
      setStreaks(next);
      if (streakTimer.current) clearTimeout(streakTimer.current);
      streakTimer.current = setTimeout(() => setStreaks([]), 1500);
    },
    [reduced]
  );

  /** Pop a manga onomatopoeia stamp over the track. */
  const spawnStamp = useCallback(() => {
    if (reduced || !fxLayerRef.current) return;
    const el = document.createElement("span");
    el.className = "anime-sfx-stamp";
    el.textContent = SLIDE_SFX[Math.floor(Math.random() * SLIDE_SFX.length)];
    el.style.cssText = `
      left: ${24 + Math.random() * 52}%;
      top: ${14 + Math.random() * 52}%;
      --sfx-rot: ${(Math.random() - 0.5) * 24}deg;
      --sfx-scale: ${0.65 + Math.random() * 0.35};
      color: ${SLIDE_SFX_COLORS[Math.floor(Math.random() * SLIDE_SFX_COLORS.length)]};
      font-size: clamp(1.1rem, 2.4vw, 2rem);
    `;
    fxLayerRef.current.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }, [reduced]);

  /** Soft directional impact shake on the slide viewport. */
  const shakeTrack = useCallback(
    (direction: number) => {
      if (reduced || !shakeBoxRef.current) return;
      const el = shakeBoxRef.current;
      el.classList.remove("exp-shake-soft");
      void el.offsetWidth; // reflow so the animation can restart
      el.style.setProperty("--exp-dir", String(direction));
      el.classList.add("exp-shake-soft");
    },
    [reduced]
  );

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-timeline-card]");
    if (!cards[index]) return;

    const direction: number = index >= activeIndex ? 1 : -1;
    setActiveIndex(index);
    cards[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    // Anime slide FX — streaks + impact shake + manga stamp + katana whoosh
    fireStreaks(direction);
    shakeTrack(direction);
    spawnStamp();
    play("katana");
  };

  // Sync active index on manual horizontal scroll
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-timeline-card]");
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, i) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(trackCenter - cardCenter);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = i;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
    <section id="experience" className="relative w-full overflow-hidden py-24 md:py-32">
      {/* Anime decorative elements */}
      <AnimeDecoText word="力" position="left" />
      <AnimePetals count={2} />
      {/* Background Subtle Ambience */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/4 size-[32rem] rounded-full bg-accent/5 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-1/4 size-[32rem] rounded-full bg-white/[0.02] blur-3xl" />

      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-10 lg:px-16">
        {/* Header Strip — slides in from opposite sides on first view */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            onViewportEnter={() => {
              // One-shot anime burst when the section slides into view
              fireStreaks(1);
              spawnStamp();
            }}
            transition={{ duration: 0.8, ease: EASE_EXPO }}
          >
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <Sparkles className="size-3.5 text-accent" />
              <span>Experience — 経歴と歴史</span>
            </p>
            <KineticText
              as="h2"
              mode="scroll"
              text="Four Years in Motion"
              className="text-section font-display font-extrabold uppercase tracking-[-0.02em] text-fg"
            />
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.15 }}
            className="max-w-sm text-sm leading-relaxed text-muted"
          >
            From agency sprints to fintech design systems, an evolving journey through typography, motion, and code.
          </motion.p>
        </div>

        {/* Interactive Year Navigation Bar & Carousel Controls */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {site.timeline.map((entry, i) => (
              <motion.button
                key={entry.year}
                initial={reduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.06 * i }}
                onClick={() => scrollToIndex(i)}
                className={`relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeIndex === i
                    ? "text-bg"
                    : "text-muted hover:border-line hover:text-fg"
                }`}
              >
                {activeIndex === i && (
                  <motion.div
                    layoutId="timelinePill"
                    className="absolute inset-0 rounded-full bg-fg"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{entry.label}</span>
              </motion.button>
            ))}

            <motion.button
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.06 * site.timeline.length }}
              onClick={() => scrollToIndex(site.timeline.length)}
              className={`relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeIndex === site.timeline.length
                  ? "text-bg"
                  : "text-muted hover:border-line hover:text-fg"
              }`}
            >
              {activeIndex === site.timeline.length && (
                <motion.div
                  layoutId="timelinePill"
                  className="absolute inset-0 rounded-full bg-fg"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">Telemetry · 測定</span>
            </motion.button>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous milestone"
              whileTap={reduced ? undefined : { scale: 0.85, x: -3 }}
              className="grid size-10 place-items-center rounded-full border border-line text-muted transition-all duration-200 hover:border-fg hover:text-fg disabled:opacity-30 disabled:hover:border-line disabled:hover:text-muted"
            >
              <ChevronLeft className="size-4" />
            </motion.button>
            <motion.button
              onClick={() => scrollToIndex(Math.min(totalItems - 1, activeIndex + 1))}
              disabled={activeIndex === totalItems - 1}
              aria-label="Next milestone"
              whileTap={reduced ? undefined : { scale: 0.85, x: 3 }}
              className="grid size-10 place-items-center rounded-full border border-line text-muted transition-all duration-200 hover:border-fg hover:text-fg disabled:opacity-30 disabled:hover:border-line disabled:hover:text-muted"
            >
              <ChevronRight className="size-4" />
            </motion.button>
          </div>
        </div>

        {/* Slide FX wrapper — soft impact shake + streak/SFX layers */}
        <div ref={shakeBoxRef} className="relative">
          {/* Speed-streak + manga SFX layer */}
          <div
            ref={fxLayerRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          >
            {streaks.map((s) => (
              <span
                key={s.id}
                className={`anime-streak active ${s.reverse ? "reverse" : ""}`}
                style={{
                  top: `${s.top}%`,
                  width: "100%",
                  height: s.height,
                  animationDelay: `${s.delay}s`,
                  ...(s.alt
                    ? { background: "linear-gradient(90deg, transparent, var(--accent2), transparent)" }
                    : {}),
                }}
              />
            ))}
          </div>

          {/* Milestone Cards Horizontal Track */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="mt-10 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-8 pt-4 scrollbar-none md:gap-8"
          >
            {site.timeline.map((entry, index) => {
              const active = activeIndex === index;
              const fromRight = index % 2 === 1;
              return (
                <motion.article
                  key={entry.year}
                  data-timeline-card
                  initial={reduced ? false : { opacity: 0, x: fromRight ? 130 : -130, rotate: fromRight ? 2.5 : -2.5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.9, ease: EASE_EXPO }}
                  className={`theme-fade group relative flex w-[85vw] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface/90 p-8 shadow-xl backdrop-blur-md transition-colors duration-300 hover:border-fg/40 md:w-[50vw] md:p-10 lg:w-[38vw] ${
                    active ? "border-accent/40 shadow-2xl shadow-accent/5" : ""
                  }`}
                >
                  {/* Anime sheen sweep on activation */}
                  {active && !reduced && (
                    <span key={`sheen-${activeIndex}`} aria-hidden className="exp-sheen" />
                  )}

                  {/* Year & Organization Header */}
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="block overflow-hidden">
                        <motion.span
                          key={active ? "yr-in" : "yr"}
                          initial={active && !reduced ? { y: "70%", opacity: 0 } : false}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.55, ease: EASE_EXPO }}
                          className="block font-display text-6xl font-extrabold tracking-tight text-fg md:text-7xl"
                        >
                          {entry.label}
                        </motion.span>
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full border border-line bg-bg/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
                        <Building2 className="size-3 text-accent" />
                        {entry.org}
                      </span>
                    </div>

                    {/* Sliding accent underline — draws in when card activates */}
                    <motion.div
                      aria-hidden
                      className="exp-underline mt-3 h-[3px] w-24"
                      initial={false}
                      animate={{ scaleX: active ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: EASE_EXPO }}
                      style={{ originX: 0 }}
                    />

                    <div className="mt-8">
                      <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-fg md:text-3xl">
                        {entry.role}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                        {entry.note}
                      </p>
                    </div>
                  </div>

                  {/* Skills Footer */}
                  <div className="mt-10 border-t border-line/60 pt-6">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">Technologies & Focus</span>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {entry.skills.map((skill, si) => (
                        <motion.li
                          key={active ? `chip-in-${skill}` : skill}
                          initial={active && !reduced ? { opacity: 0, y: 16 } : false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: EASE_EXPO, delay: active ? 0.07 * si : 0 }}
                          className="rounded-full border border-line bg-bg/60 px-3.5 py-1.5 text-xs text-muted transition-colors duration-200 group-hover:border-fg/30 group-hover:text-fg"
                        >
                          {skill}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              );
            })}

          {/* Stats Telemetry Panel */}
          <motion.article
            data-timeline-card
            initial={reduced ? false : { opacity: 0, x: 130, rotate: 2.5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
            className={`theme-fade relative flex w-[85vw] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface/90 p-8 shadow-xl backdrop-blur-md transition-colors duration-300 hover:border-fg/40 md:w-[45vw] md:p-10 lg:w-[34vw] ${
              activeIndex === site.timeline.length ? "border-accent/40 shadow-2xl shadow-accent/5" : ""
            }`}
          >
            {activeIndex === site.timeline.length && !reduced && (
              <span key={`sheen-${activeIndex}`} aria-hidden className="exp-sheen" />
            )}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <Sparkles className="size-3.5 text-accent" />
                <span>Practice Telemetry</span>
              </div>
              <h3 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-fg">
                By the Numbers
              </h3>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {STATS.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-line/70 bg-bg/50 p-4">
                    <p className="font-display text-4xl font-extrabold text-accent md:text-5xl">
                      {String(stat.value).padStart(2, "0")}
                      <span className="text-2xl text-fg font-normal">{stat.suffix}</span>
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-line/60 pt-6">
              <p className="text-xs leading-relaxed text-muted">
                {site.about.intro}
              </p>
            </div>
          </motion.article>
          </div>
        </div>

        {/* Bottom Horizontal Progress Bar Indicator */}
        <div className="mt-4 flex w-full items-center justify-between gap-4">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <motion.div
              className="relative h-full rounded-full bg-accent"
              initial={false}
              animate={{ width: `${((activeIndex + 1) / totalItems) * 100}%` }}
              transition={{ type: "spring", stiffness: 170, damping: 22 }}
            >
              {/* Glowing comet head that slides with the progress */}
              <span
                aria-hidden
                className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
              />
            </motion.div>
          </div>
          <span className="inline-block overflow-hidden font-display text-xs font-bold text-muted">
            <motion.span
              key={activeIndex}
              initial={reduced ? false : { y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE_EXPO }}
              className="block"
            >
              0{activeIndex + 1} / 0{totalItems}
            </motion.span>
          </span>
        </div>
      </div>
    </section>
  );
}
