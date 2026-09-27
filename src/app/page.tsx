import Hero from "@/components/hero/Hero";
import SelectedWorks from "@/components/works/SelectedWorks";
import AboutSection from "@/components/about/AboutSection";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import FooterContact from "@/components/footer/FooterContact";
import SectionDivider from "@/components/background/SectionDivider";
import AsciiGlitchRipple from "@/components/ui/ascii-glitch-ripple";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <SectionDivider label="Selected Work" />
      <SelectedWorks />
      <SectionDivider label="About & Skills" />
      <AboutSection />
      <SectionDivider label="Experience & History" />
      <ExperienceTimeline />
      <SectionDivider label="Get In Touch" />
      <FooterContact />
      <AsciiGlitchRipple
        href="#top"
        data-cursor="hover"
        className="fixed bottom-4 right-4 z-[110] text-xs font-mono uppercase tracking-widest text-muted hover:text-fg"
      >
        glitch back to top
      </AsciiGlitchRipple>
    </main>
  );
}
