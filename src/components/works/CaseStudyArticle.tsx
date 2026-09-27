import type { Project } from "@/data/projects";

/**
 * Shared case-study body (meta grid + narrative sections) used by both
 * the instant-preview modal and the standalone /work/[slug] page.
 */
export default function CaseStudyArticle({ project }: { project: Project }) {
  const sections: Array<[string, string]> = [
    ["The brief", project.body.brief],
    ["Approach", project.body.approach],
    ["Solution", project.body.solution],
    ["Outcome", project.body.outcome],
  ];

  return (
    <>
      <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
        {(
          [
            ["Client", project.client],
            ["Year", String(project.year)],
            ["Role", project.role],
            ["Stack", project.tech.join(" · ")],
          ] as Array<[string, string]>
        ).map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {label}
            </dt>
            <dd className="mt-1.5 text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      {sections.map(([heading, text]) => (
        <section key={heading} data-dissolve="subtle" className="mt-10 max-w-2xl">
          <h3 className="font-display text-xl font-bold md:text-2xl">{heading}</h3>
          <p className="mt-3 leading-relaxed text-muted">{text}</p>
        </section>
      ))}
    </>
  );
}
