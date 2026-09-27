import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import CaseStudyArticle from "@/components/works/CaseStudyArticle";
import ProjectCover from "@/components/works/ProjectCover";
import { projects } from "@/data/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${project.client}`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main
      id="main"
      className="relative mx-auto w-full max-w-[1080px] px-6 pb-24 pt-28 md:pt-36"
    >
      <Link
        href="/#works"
        data-cursor="hover"
        className="link-underline inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-fg"
      >
        <ArrowLeft className="size-4" /> All work
      </Link>

      <header data-dissolve className="mt-10">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">
          {project.category} — {project.year}
        </p>
        <h1 className="text-section font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-body text-muted">{project.summary}</p>
      </header>

      <div data-dissolve="subtle" className="group mt-12 overflow-hidden rounded-2xl border border-line">
        <ProjectCover project={project} className="aspect-[16/8] w-full" />
      </div>

      <article className="mt-4">
        <CaseStudyArticle project={project} />

        <div data-dissolve="subtle" className="mt-12 flex flex-wrap gap-3">
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
            className="theme-fade inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-fg active:scale-[0.97]"
          >
            Source code
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </article>

      {/* prev / next */}
      <nav
        data-dissolve
        aria-label="More case studies"
        className="mt-20 grid gap-4 border-t border-line pt-10 md:grid-cols-2"
      >
        {(
          [
            ["Previous", prev, ArrowLeft],
            ["Next", next, ArrowRight],
          ] as const
        ).map(([label, item, Icon]) => (
          <Link
            key={item.slug}
            href={`/work/${item.slug}`}
            data-cursor="hover"
            className="theme-fade group flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-accent"
          >
            <span>
              <span className="block text-[11px] uppercase tracking-[0.16em] text-muted">
                {label} case study
              </span>
              <span className="mt-1 block font-display text-xl font-bold">
                {item.title}
              </span>
            </span>
            <Icon className="size-5 shrink-0 text-muted transition-colors duration-200 group-hover:text-accent" />
          </Link>
        ))}
      </nav>
    </main>
  );
}
