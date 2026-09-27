import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { hashString, mulberry32 } from "@/lib/utils";

/**
 * Deterministic generative cover art — layered gradients, an oversized
 * outlined initial and film grain, seeded from the project slug.
 * The cover is a `container-type: size` container so the art layers
 * parallax in true container cqh units (CSS scroll-driven animation).
 * Swap for real artwork by dropping images in later.
 */
export default function ProjectCover({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const rand = mulberry32(hashString(project.slug));
  const gx = 18 + Math.round(rand() * 64);
  const gy = 18 + Math.round(rand() * 64);
  const angle = Math.round(-24 + rand() * 48);
  const initial = project.title.charAt(0).toUpperCase();

  return (
    <div
      className={`noise-overlay relative overflow-hidden bg-surface [container-type:size] ${className ?? ""}`}
      style={{ "--pc": project.color } as CSSProperties}
    >
      {/* art layer rides a scroll-driven cqh parallax; hover zoom stays inner */}
      <div
        aria-hidden
        data-parallax
        className="absolute inset-[-14%]"
        style={{ "--parallax": "5" } as CSSProperties}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover object-top transition-transform duration-[400ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-[400ms] ease-out group-hover:scale-105"
            style={{
              background: `radial-gradient(120% 90% at ${gx}% ${gy}%, ${project.color}40 0%, transparent 58%), linear-gradient(${angle}deg, ${project.color}1f 0%, transparent 55%)`,
            }}
          />
        )}
      </div>
      {!project.image && (
        <span
          aria-hidden
          data-parallax="smooth"
          className="absolute -bottom-[0.18em] -right-3 font-display text-[9rem] font-extrabold leading-none opacity-[0.16] md:text-[12rem]"
          style={
            {
              WebkitTextStroke: `1px ${project.color}`,
              color: "transparent",
              "--parallax": "10",
            } as CSSProperties
          }
        >
          {initial}
        </span>
      )}
      <span
        aria-hidden
        className="absolute left-5 top-5 rounded border border-white/10 bg-black/75 px-2.5 py-1 backdrop-blur-md font-display text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm"
      >
        {project.category}
      </span>
    </div>
  );
}
