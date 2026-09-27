"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import KineticText from "@/components/typography/KineticText";
import WorkStackCard from "@/components/works/WorkStackCard";
import CaseStudyModal from "@/components/works/CaseStudyModal";
import AnimeDecoText from "@/components/fx/AnimeDecoText";

import { projects, type Project } from "@/data/projects";

/**
 * Selected works — sticky card pile.
 * The cards are stacked grid rows that pin below the floating nav and
 * fan out as you scroll; each inner card content scales down over its
 * own scroll-driven passage (see `.works-stack` in globals.css).
 * The filter pills re-key the list so `--numcards` / `--index` recompute
 * and the stack reproduces itself for the active category.
 */
export default function SelectedWorks() {
  const [category, setCategory] = useState<string>("All");
  const [active, setActive] = useState<Project | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    []
  );

  const filtered = useMemo(
    () =>
      category === "All" ? projects : projects.filter((p) => p.category === category),
    [category]
  );

  return (
    <section
      id="works"
      data-dissolve
      style={{ "--dissolve-start": "70%" } as CSSProperties}
      className="relative mx-auto w-full max-w-[1920px] scroll-mt-24 px-6 pb-32 pt-24 md:px-10 md:pb-48 md:pt-36 lg:px-16"
    >
      {/* Anime decorative elements */}
      <AnimeDecoText word="作" position="right" />

      <header
        data-drift
        style={{ "--drift": "5" } as CSSProperties}
        className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20"
      >
        <div>
          <p
            data-reveal
            className="mb-4 text-xs uppercase tracking-[0.2em] text-accent"
          >
            Selected works — 2020 → 2025
          </p>
          <KineticText
            as="h2"
            mode="scroll"
            text="Selected Works"
            className="text-section font-display font-extrabold uppercase tracking-[-0.02em]"
          />
        </div>
        <p
          data-reveal="late"
          className="max-w-sm text-sm leading-relaxed text-muted"
        >
          A scrolling pile of six case studies in typography, motion and code.
          Scroll to fan them out, hover to feel the tilt, click for the full
          story.
        </p>
      </header>

      {/* Filter pills — toggle buttons with pressed state */}
      <div className="mb-14 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {categories.map((c) => {
          const isActive = c === category;
          return (
            <button
              key={c}
              aria-pressed={isActive}
              data-cursor="hover"
              onClick={() => setCategory(c)}
              className={`theme-fade relative rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] transition duration-200 active:scale-95 ${
                isActive
                  ? "border-accent text-bg"
                  : "border-line text-muted hover:border-fg/30 hover:text-fg"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-filter-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          );
        })}
      </div>

      {/* Sticky card pile — keyed by category so the stack re-fans on filter */}
      <ol
        key={category}
        aria-label="Selected works"
        className="works-stack"
        style={{ "--numcards": filtered.length } as CSSProperties}
      >
        {filtered.map((project, i) => (
          <li key={project.slug} style={{ "--index": i + 1 } as CSSProperties}>
            <WorkStackCard
              project={project}
              index={i + 1}
              total={filtered.length}
              onOpen={setActive}
            />
          </li>
        ))}
      </ol>

      <CaseStudyModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
