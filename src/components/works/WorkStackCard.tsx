"use client";

import { useRef, useCallback, type CSSProperties, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import ProjectCover from "@/components/works/ProjectCover";
import type { Project } from "@/data/projects";
import { EASE_EXPO, TILT_SPRING } from "@/lib/utils";

/** True only on pointer-capable (non-touch) devices */
const canHover =
  typeof window === "undefined"
    ? false
    : window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const MAX_ANGLE = 9;

const KANJI_NUMS = ["壱", "弐", "参", "四", "伍", "六", "七", "八", "九", "十"];

/**
 * Enhanced WorkStackCard with 3D multi-layered parallax shift
 * and holographic iridescent glare effect.
 */
export default function WorkStackCard({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (project: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /** Skip every mousemove that arrives before the current RAF fires */
  const rafPending = useRef(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, TILT_SPRING);
  const rotateY = useSpring(ry, TILT_SPRING);

  // Parallax offsets for inner elements
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const textX = useSpring(tx, TILT_SPRING);
  const textY = useSpring(ty, TILT_SPRING);

  const ax = useMotionValue(0);
  const ay = useMotionValue(0);
  const artX = useSpring(ax, TILT_SPRING);
  const artY = useSpring(ay, TILT_SPRING);

  // Glare position
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(550px circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.14), transparent 65%)`;

  // Holographic shimmer angle
  const holoAngle = useMotionValue(135);
  const holoGradient = useMotionTemplate`linear-gradient(${holoAngle}deg, rgba(255,0,128,0.08) 0%, rgba(0,255,240,0.08) 33%, rgba(255,230,0,0.08) 66%, rgba(120,0,255,0.08) 100%)`;

  // Cache rect so getBoundingClientRect isn't called every mousemove frame
  const cachedRect = useRef<DOMRect | null>(null);

  const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    // Only pointer-capable devices get the tilt effect
    if (!canHover) return;
    // Throttle: one batch of MotionValue writes per animation frame
    if (rafPending.current) return;
    rafPending.current = true;

    const rect = cachedRect.current ?? ref.current?.getBoundingClientRect();
    if (!rect) { rafPending.current = false; return; }

    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    requestAnimationFrame(() => {
      rx.set(relY * -MAX_ANGLE);
      ry.set(relX * MAX_ANGLE);
      tx.set(relX * -12);
      ty.set(relY * -12);
      ax.set(relX * 16);
      ay.set(relY * 16);
      gx.set((relX + 0.5) * 100);
      gy.set((relY + 0.5) * 100);
      holoAngle.set(135 + relX * 90);
      rafPending.current = false;
    });
  }, [ax, ay, gx, gy, holoAngle, rx, ry, tx, ty]);

  const handleEnter = useCallback(() => {
    // Cache the rect once on enter — avoids per-frame layout reads
    cachedRect.current = ref.current?.getBoundingClientRect() ?? null;
  }, []);

  const handleLeave = useCallback(() => {
    cachedRect.current = null;
    rx.set(0);
    ry.set(0);
    tx.set(0);
    ty.set(0);
    ax.set(0);
    ay.set(0);
  }, [ax, ay, rx, ry, tx, ty]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 56 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_EXPO }}
      whileHover={{ scale: 1.012, transition: { duration: 0.25, ease: "easeOut" } }}
      whileTap={{ scale: 0.995 }}
      className="works-stack__card theme-fade group"
      style={
        {
          "--pc": project.color,
          transformPerspective: 1400,
          rotateX,
          rotateY,
        } as CSSProperties
      }
    >
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        data-cursor="view"
        data-cursor-label="View project"
        onClick={() => onOpen(project)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(project);
          }
        }}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        aria-label={`Open case study: ${project.title}`}
        className="relative flex h-full flex-col overflow-hidden"
      >
        <div className="works-stack__content">
          <motion.div
            className="works-stack__text"
            style={{ x: textX, y: textY }}
          >
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent md:text-xs">
              <span className="font-display text-xl font-extrabold tracking-tight md:text-2xl">
                {String(index).padStart(2, "0")}
                <span className="text-muted">/{String(total).padStart(2, "0")}</span>
                <span className="ml-1.5 text-xs text-accent/80 font-mono font-medium">[{KANJI_NUMS[index - 1] || "壱"}]</span>
              </span>
              {project.category} — {project.year}
            </p>

            <h3 className="anime-focus-line font-display text-card font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
              {project.title}
            </h3>

            <p className="line-clamp-3 max-w-xl text-body leading-relaxed text-muted md:line-clamp-4">
              {project.summary}
            </p>

            <ul className="hidden flex-wrap gap-2 md:flex" aria-label="Technologies">
              {project.tech.map((t) => (
                <li
                  key={t}
                  className="theme-fade rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-muted transition-colors duration-200 group-hover:border-accent/40 group-hover:text-fg"
                >
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors duration-200 group-hover:text-accent">
                Read case study
                <span className="text-xs font-mono font-bold text-accent opacity-80 group-hover:opacity-100">· 閲覧</span>
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:text-bg"
                aria-label={`Visit live website for ${project.title}`}
              >
                Live Demo
                <ExternalLink className="size-3" />
              </a>
            </div>
          </motion.div>

          <motion.figure
            className="works-stack__art"
            style={{ x: artX, y: artY }}
          >
            <ProjectCover project={project} className="h-full" />
            <figcaption className="sr-only">{project.title} — generative cover</figcaption>
          </motion.figure>
        </div>

        {/* Holographic Iridescent Shimmer — mix-blend-mode:screen is compositor-
            friendly on dark surfaces (avoids stacking-context cost of overlay) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: holoGradient }}
        />

        {/* Hover Light Glare — show only on pointer devices */}
        {canHover && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ background: glare }}
          />
        )}
      </div>
    </motion.article>
  );
}