"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Magnetic from "@/components/cursor/Magnetic";
import CaseStudyArticle from "@/components/works/CaseStudyArticle";
import ProjectCover from "@/components/works/ProjectCover";
import type { Project } from "@/data/projects";
import { getLenis } from "@/lib/lenis";
import { EASE_EXPO } from "@/lib/utils";

/**
 * Full-screen instant case-study preview.
 * Esc to close · focus is trapped while open and restored on close ·
 * page scroll pauses via Lenis. The standalone page lives at /work/[slug].
 */
export default function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lastFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Trap Tab focus inside the dialog panel
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      lastFocused.current?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-bg/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`Case study: ${project.title}`}
          data-lenis-prevent
        >
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 48, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: EASE_EXPO }}
            className="relative mx-auto my-8 w-[min(1080px,calc(100%-2rem))] overflow-hidden rounded-2xl border border-line bg-surface md:my-14"
          >
            <div className="absolute right-4 top-4 z-10">
              <Magnetic force={0.3}>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close case study"
                  className="grid size-11 place-items-center rounded-full border border-line bg-bg/60 text-fg backdrop-blur-md transition-colors duration-200 hover:border-accent hover:text-accent active:scale-95"
                >
                  <X className="size-5" />
                </button>
              </Magnetic>
            </div>

            <ProjectCover project={project} className="aspect-[16/7] w-full" />

            <div className="p-6 md:p-12">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">
                {project.category} — {project.year}
              </p>
              <h2 className="font-display text-section font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
                {project.title}
              </h2>
              <p className="mt-6 max-w-2xl text-body text-muted">{project.summary}</p>

              <CaseStudyArticle project={project} />

              <div className="mt-12 flex flex-wrap gap-3">
                <Link
                  data-cursor="hover"
                  href={`/work/${project.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  Open full case study
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <a
                  data-cursor="hover"
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  Visit live site
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a
                  data-cursor="hover"
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="theme-fade inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-fg"
                >
                  Source code
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
