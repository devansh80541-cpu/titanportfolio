"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Magnetic from "@/components/cursor/Magnetic";
import ThemeToggle from "@/components/nav/ThemeToggle";
import SoundToggle from "@/components/nav/SoundToggle";
import { site } from "@/data/site";
import { scrollToId } from "@/lib/lenis";
import { EASE_EXPO } from "@/lib/utils";

const LINKS = [
  { label: "Work", ja: "実績", target: "#works" },
  { label: "About", ja: "概要", target: "#about" },
  { label: "Experience", ja: "経歴", target: "#experience" },
  { label: "Contact", ja: "連絡", target: "#contact" },
];

const SECTION_IDS = ["works", "about", "experience", "contact"];

/**
 * Floating island bar — backdrop blur, magnetic links, theme-aware tokens.
 * Features:
 *  - Active section indicator (sliding dot via layoutId)
 *  - Hide on scroll-down, show on scroll-up
 *  - Scroll progress bar at the top of the viewport
 *  - Nav morph (subtle shrink + increased blur) on scroll
 *  - Link hover background pill micro-interaction
 *  - Mobile overlay with staggered cascade
 */
export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Scroll direction detection + progress bar + section tracking
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;

        setScrollProgress(progress);
        setScrolled(y > 40);

        // Hide on scroll-down (past 300px), show on scroll-up
        if (y > 300) {
          const delta = y - lastScrollY.current;
          if (delta > 8) {
            setHidden(true);
          } else if (delta < -4) {
            setHidden(false);
          }
        } else {
          setHidden(false);
        }

        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (pathname !== "/") return;

    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }

          // Find the most visible section
          let best = "";
          let bestRatio = 0;
          visibleSections.forEach((ratio, sId) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = sId;
            }
          });
          setActiveSection(best);
        },
        { rootMargin: "-20% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [pathname]);

  function handleNav(e: MouseEvent<HTMLAnchorElement>, target: string) {
    if (pathname === "/") {
      e.preventDefault();
      setOpen(false);
      // let the mobile overlay exit before gliding
      window.setTimeout(() => scrollToId(target), open ? 250 : 0);
    } else {
      setOpen(false); // navigate via href to /#target
    }
  }

  return (
    <>
      {/* Scroll progress bar — top of viewport */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left"
        style={{
          background: "var(--accent)",
          transform: `scaleX(${scrollProgress})`,
          opacity: scrollProgress > 0.005 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        aria-hidden
      />

      <motion.header
        className="fixed inset-x-0 top-[2px] z-40 flex justify-center px-4 pt-2"
        initial={false}
        animate={{
          y: hidden && !open ? -80 : 0,
          opacity: hidden && !open ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: EASE_EXPO }}
      >
        <nav
          aria-label="Primary"
          className={`theme-fade flex items-center gap-1 rounded-full border py-1.5 pl-2 pr-2 backdrop-blur-[12px] transition-all duration-300 md:pl-3 ${
            scrolled
              ? "border-line bg-surface/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[20px]"
              : "border-transparent bg-surface/70"
          }`}
          style={{
            // Subtle morph: slightly smaller on scroll
            transform: scrolled ? "scale(0.97)" : "scale(1)",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s, background-color 0.3s, backdrop-filter 0.3s",
          }}
        >
          <Magnetic force={0.3}>
            <Link
              href="/#top"
              onClick={(e) => handleNav(e, "#top")}
              aria-label="Back to top"
              data-cursor="hover"
              className="grid size-9 place-items-center rounded-full bg-fg font-display text-sm font-extrabold text-bg transition-transform duration-200 active:scale-95 anime-glow"
            >
              {site.initials}
            </Link>
          </Magnetic>

          <ul className="ml-2 hidden items-center md:flex">
            {LINKS.map((link) => {
              const sectionId = link.target.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <li key={link.label} className="relative">
                  <Magnetic force={0.4}>
                    <Link
                      href={`/${link.target}`}
                      onClick={(e) => handleNav(e, link.target)}
                      data-cursor="hover"
                      className="relative z-10 rounded-full px-4 py-2 text-sm transition duration-200 hover:text-fg active:opacity-70"
                      style={{
                        color: isActive ? "var(--fg)" : "var(--fg-muted)",
                      }}
                    >
                      {/* Hover background pill */}
                      <span className="absolute inset-0 rounded-full bg-fg/[0.05] opacity-0 transition-opacity duration-200 hover:opacity-100" />
                      <span className="relative flex items-center gap-1.5">
                        <span>{link.label}</span>
                        <span className="text-[10px] opacity-70 font-mono tracking-tight font-medium text-accent">({link.ja})</span>
                      </span>
                      {/* Active section sliding dot */}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-dot"
                          className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 28,
                          }}
                        />
                      )}
                    </Link>
                  </Magnetic>
                </li>
              );
            })}
          </ul>

          {/* Sonic UI + light/dark toggles */}
          <SoundToggle />
          <ThemeToggle />

          <div className="ml-2 hidden md:block">
            <Magnetic force={0.3}>
              <Link
                href="/#contact"
                onClick={(e) => handleNav(e, "#contact")}
                data-cursor="hover"
                className="theme-fade anime-glow inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-muted transition duration-200 hover:border-accent hover:text-fg active:scale-[0.97]"
              >
                <span className="relative flex size-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-accent2 opacity-60" />
                  <span className="relative size-1.5 rounded-full bg-accent" />
                </span>
                Open to work · 稼働中
              </Link>
            </Magnetic>
          </div>

          <button
            className="ml-1 grid size-9 place-items-center rounded-full text-fg md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-lg font-extrabold uppercase tracking-tight">
                {site.name}
              </span>
              <div className="flex items-center gap-2">
                <SoundToggle />
                <ThemeToggle />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-full border border-line"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-6" aria-label="Mobile">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -40, y: 24 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: EASE_EXPO }}
                >
                  <Link
                    href={`/${link.target}`}
                    onClick={(e) => handleNav(e, link.target)}
                    className="flex items-center justify-between border-b border-line py-5 text-left font-display text-4xl font-bold uppercase tracking-tight"
                  >
                    {link.label}
                    <ArrowUpRight className="size-6 text-accent" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-6 pb-10 text-xs uppercase tracking-[0.18em] text-muted"
            >
              {site.email} — {site.location}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
