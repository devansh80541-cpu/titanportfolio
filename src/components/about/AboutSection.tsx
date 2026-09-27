import KineticText from "@/components/typography/KineticText";
import CrazySkillsSection from "@/components/about/CrazySkillsSection";
import AnimeDecoText from "@/components/fx/AnimeDecoText";

import { site } from "@/data/site";

/**
 * Editorial about section featuring high-impact typography
 * and the crazy interactive quantum skill matrix.
 */
export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-[1920px] scroll-mt-24 px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      {/* Anime decorative elements */}
      <AnimeDecoText word="技" position="right" />
      <AnimeDecoText word="創" position="left" className="hidden lg:block" />
      {/* Upper Editorial Bio */}
      <div className="mb-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p
            data-reveal
            className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent"
          >
            About — the person behind the pixels
          </p>
          <KineticText
            as="h2"
            mode="scroll"
            text="Design-minded, code-driven"
            className="text-section font-display font-extrabold uppercase leading-[1.02] tracking-[-0.02em]"
          />
          <p data-reveal="late" className="mt-8 text-body leading-relaxed text-muted">
            {site.about.intro}
          </p>
        </div>

        <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
          {site.about.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              data-reveal="late"
              className="mb-6 text-body leading-relaxed text-muted first:text-fg first:text-lg first:font-medium"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Crazy Interactive Skill Matrix */}
      <CrazySkillsSection />
    </section>
  );
}
