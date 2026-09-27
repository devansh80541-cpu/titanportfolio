"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import KineticText from "@/components/typography/KineticText";
import Magnetic from "@/components/cursor/Magnetic";
import AsciiGlitchRipple from "@/components/ui/ascii-glitch-ripple";
import { site } from "@/data/site";
import { gsap } from "@/lib/gsap";
import { scrollToId } from "@/lib/lenis";
import { useInView } from "@/lib/use-in-view";
import FooterWave from "@/components/fx/FooterWave";
import AnimeDecoText from "@/components/fx/AnimeDecoText";
import AnimePetals from "@/components/fx/AnimePetals";

import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { play } from "@/lib/sound";



// Text scramble chars pool
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&01";

function useTextScramble(targetText: string, trigger: boolean, duration = 1200) {
  const [display, setDisplay] = useState(targetText);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!trigger) {
      setDisplay(targetText);
      return;
    }

    const chars = SCRAMBLE_CHARS;
    const length = targetText.length;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      let result = "";
      for (let i = 0; i < length; i++) {
        const charProgress = i / length;
        if (progress > charProgress + 0.15) {
          // Reveal real character
          result += targetText[i];
        } else if (progress > charProgress - 0.1) {
          // Scramble zone
          result += chars[Math.floor(Math.random() * chars.length)];
        } else {
          // Not yet reached
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplay(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(targetText);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [trigger, targetText, duration]);

  return display;
}

/**
 * Full-screen fluid reveal — giant clipboard-copy email trigger,
 * magnetic social pills, live IST clock.
 *
 * Upgrades:
 *  - Horizontal rule draws itself left-to-right on viewport entry
 *  - Email text scramble/decode effect on reveal
 *  - Social pills stagger cascade with perspective tilt
 *  - Clock colon blink animation
 *  - "Back to top" button with circular scroll progress ring
 *  - Animated background gradient drift
 */
export default function FooterContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const { ref: clockRef, inView: clockInView } = useInView<HTMLSpanElement>();
  const { ref: emailRef, inView: emailInView } = useInView<HTMLDivElement>();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [time, setTime] = useState("--:--:--");
  const [emailRevealed, setEmailRevealed] = useState(false);
  const reduced = usePrefersReducedMotion();

  const scrambledEmail = useTextScramble(
    site.emailDisplay,
    emailRevealed && !reduced,
    1400
  );

  // Trigger email scramble when it enters view (once)
  useEffect(() => {
    if (emailInView && !emailRevealed) {
      setEmailRevealed(true);
    }
  }, [emailInView, emailRevealed]);

  // Theme: back to dark graphite as the footer takes the viewport


  // Horizontal rule draw animation
  useEffect(() => {
    if (reduced) return;
    const rule = ruleRef.current;
    if (!rule) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: rule,
            start: "top 90%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [reduced]);

  // Social pills stagger entrance
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const pills = section.querySelectorAll("[data-footer-pill]");
      if (pills.length === 0) return;

      gsap.fromTo(
        pills,
        { opacity: 0, y: 20, rotateX: -15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pills[0],
            start: "top 88%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const progressCircleRef = useRef<SVGCircleElement>(null);

  // Scroll progress for back-to-top ring (direct DOM update, zero React re-renders)
  useEffect(() => {
    let rafId = 0;
    const r = 14;
    const circumference = 2 * Math.PI * r;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const circle = progressCircleRef.current;
        if (!circle) return;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
        circle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Real-time local clock (Asia/Kolkata)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: site.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const copyEmail = useCallback(async () => {
    let success = false;
    try {
      await navigator.clipboard.writeText(site.email);
      success = true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = site.email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        success = true;
      } catch {
        success = false;
      }
    }
    if (success) {
      setCopyFailed(false);
      setCopied(true);
      play("chime");
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 3000);
    }
  }, []);

  // Format time with blinking colons
  const formatTimeWithBlink = (t: string) => {
    const parts = t.split(":");
    if (parts.length < 3) return t;
    return (
      <>
        {parts[0]}
        <span className="colon-blink">:</span>
        {parts[1]}
        <span className="colon-blink">:</span>
        {parts[2]}
      </>
    );
  };


  return (
    <footer
      id="contact"
      ref={sectionRef}
      data-dissolve
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-8 pt-32 md:px-10 md:pt-40 lg:px-16"
    >
      {/* Anime decorative elements */}
      <AnimeDecoText word="金" position="right" />
      <AnimePetals count={2} />

      {/* terracotta bloom — animated drift */}
      <div
        aria-hidden
        data-parallax="smooth"
        className="footer-bloom absolute bottom-[-20%] left-1/2 -ml-[22rem] size-[44rem] rounded-full opacity-[0.08]"
        style={
          {
            background: "radial-gradient(closest-side, var(--accent2), transparent)",
            "--parallax": "14",
          } as CSSProperties
        }
      />

      <div className="relative z-10">
        <p
          data-reveal
          className="mb-6 text-xs uppercase tracking-[0.2em] text-accent"
        >
          Contact — have a project in mind? · お問い合わせ
        </p>
        <KineticText
          as="h2"
          mode="scroll"
          text="Let's build something worth remembering"
          magneticWarp={true}
          className="max-w-5xl text-section font-display font-extrabold uppercase leading-[1.02] tracking-[-0.02em]"
        />
      </div>

      <div className="relative z-10 mt-16 flex flex-col gap-10">
        {/* Giant interactive email trigger — text scramble decode */}
        <div data-reveal="late" ref={emailRef}>
          <AsciiGlitchRipple
            data-cursor="hover"
            className="block max-w-full text-left transition-opacity duration-150 active:opacity-70 link-underline font-display font-bold tracking-tight font-mono-override text-[clamp(1.6rem,4.5vw,4.5rem)]"
            preserveSpaces={false}
            spread={1.1}
            onClick={copyEmail}
            onMouseEnter={() => play("hover")}
            aria-label={`Copy email address ${site.email} to clipboard`}
          >
            {emailRevealed && !reduced ? scrambledEmail : site.emailDisplay}
          </AsciiGlitchRipple>
          <p
            className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted"
            aria-live="polite"
          >
            {copyFailed ? (
              <>
                <Copy className="size-3.5 text-accent2" /> Copy failed — please copy manually
              </>
            ) : copied ? (
              <>
                <Check className="size-3.5 text-accent" /> Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Click to copy
              </>
            )}
          </p>
        </div>

        {/* Magnetic social pills + live clock — stagger cascade */}
        <div className="flex flex-wrap items-center gap-3" style={{ perspective: "600px" }}>
          {site.socials.map((social) => (
            <Magnetic key={social.label} force={0.3}>
              <a
                data-cursor="hover"
                data-footer-pill
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="theme-fade group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-muted transition-all duration-200 hover:border-accent hover:text-fg hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(197,168,128,0.1)] active:scale-[0.97]"
              >
                {social.label}
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
          ))}
          <span
            ref={clockRef}
            data-cursor="hover"
            data-footer-pill
            className="theme-fade inline-flex items-center gap-2.5 rounded-full border border-line px-5 py-2.5 text-sm text-muted tabular-nums"
          >
            <span className="relative flex size-1.5">
              {clockInView && (
                <span className="absolute h-full w-full animate-ping rounded-full bg-accent2 opacity-60" />
              )}
              <span className="relative size-1.5 rounded-full bg-accent" />
            </span>
            {site.location.split(",")[0]} · {formatTimeWithBlink(time)} {site.timezoneLabel.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Bottom bar — animated horizontal rule + copyright + back to top */}
      <div
        data-reveal="later"
        className="relative z-10 mt-20 flex flex-wrap items-center justify-between gap-4 pt-6 text-xs uppercase tracking-[0.14em] text-muted"
      >
        {/* Animated horizontal rule that draws left-to-right */}
        <div
          ref={ruleRef}
          className="absolute left-0 right-0 top-0 h-px origin-left bg-line"
          style={{ transform: reduced ? "scaleX(1)" : undefined }}
        />

        <p>
          © {new Date().getFullYear()} {site.name} — {site.role}
        </p>
        <p>Designed & built with GSAP, Lenis & Framer Motion</p>

        {/* Back to top with circular scroll progress ring */}
        <Magnetic force={0.3}>
          <button
            data-cursor="hover"
            onClick={() => scrollToId(0)}
            className="theme-fade group relative inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 transition duration-200 hover:border-accent hover:text-fg active:scale-[0.97]"
            aria-label="Back to top"
          >
            {/* Circular progress ring */}
            <svg
              className="absolute -left-1 -top-1 size-[calc(100%+8px)] -rotate-90"
              aria-hidden
            >
              <circle
                ref={progressCircleRef}
                cx="50%"
                cy="50%"
                r="14"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeDasharray={2 * Math.PI * 14}
                strokeDashoffset={2 * Math.PI * 14}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-75"
                opacity="0.5"
              />
            </svg>
            Back to top · 頂上へ{" "}
            <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-1" />
          </button>
        </Magnetic>
      </div>

      {/* Drifting SVG wave pair along the footer's bottom edge */}
      <FooterWave />
    </footer>
  );
}
