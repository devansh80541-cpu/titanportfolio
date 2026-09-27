"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { getLenis } from "@/lib/lenis";
import { play } from "@/lib/sound";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type LineKind = "cmd" | "out" | "accent" | "dim";
interface Line {
  text: string;
  kind: LineKind;
}

const LINE_CLASS: Record<LineKind, string> = {
  cmd: "text-accent",
  out: "text-fg/90",
  accent: "text-accent2",
  dim: "text-muted",
};

/** The transcript is built live from the site's single source of truth. */
function buildLines(): Line[] {
  return [
    { kind: "cmd", text: "$ whoami" },
    { kind: "out", text: `${site.name.toLowerCase()} — ${site.role}` },
    { kind: "cmd", text: "$ cat ./location.txt" },
    { kind: "out", text: `${site.location} · ${site.timezoneLabel}` },
    { kind: "cmd", text: "$ ls ./stack" },
    { kind: "accent", text: site.skills.join("  ·  ") },
    { kind: "cmd", text: "$ git log --oneline" },
    ...site.timeline.map(
      (t): Line => ({
        kind: "out",
        text: `${t.year}  ${t.role} — ${t.org}`,
      })
    ),
    { kind: "cmd", text: "$ ls ./case-studies | wc -l" },
    { kind: "out", text: `${projects.length} shipped (and counting)` },
    { kind: "cmd", text: "$ cat ./contact.yml" },
    { kind: "accent", text: `email: ${site.email}` },
    { kind: "dim", text: "esc or ` — close  ·  psst: type P-A-R-T-Y anywhere" },
  ];
}

/**
 * Terminal easter egg — press the backtick (`) anywhere to drop into a
 * fake CRT shell that types out real data from site.ts / projects.ts.
 * Esc, the backdrop, or the esc chip closes it. Scroll locks (Lenis)
 * while open. Instant transcript under prefers-reduced-motion.
 */
export default function TerminalEasterEgg() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [rendered, setRendered] = useState<Line[]>([]);
  const [current, setCurrent] = useState("");
  const [currentKind, setCurrentKind] = useState<LineKind>("cmd");
  const openRef = useRef(false);
  const scrollRef = useRef<HTMLPreElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Global hotkeys: backquote toggles, Escape closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openRef.current) {
        setOpen(false);
        return;
      }
      if (e.key !== "`" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll lock + focus + open/close sounds while the shell is up
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    play("open");
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      play("close");
    };
  }, [open]);

  // Typing engine — 3 chars per 16ms tick, line by line
  useEffect(() => {
    if (!open) {
      setRendered([]);
      setCurrent("");
      setDone(false);
      return;
    }
    const lines = buildLines();
    if (reduced) {
      setRendered(lines);
      setDone(true);
      return;
    }
    let li = 0;
    let ci = 0;
    setCurrentKind(lines[0]?.kind ?? "cmd");
    const id = window.setInterval(() => {
      const line = lines[li];
      if (!line) {
        window.clearInterval(id);
        setDone(true);
        return;
      }
      ci += 3;
      if (ci >= line.text.length) {
        const finished = line;
        li += 1;
        ci = 0;
        setRendered((prev) => [...prev, finished]);
        setCurrent("");
        setCurrentKind(lines[li]?.kind ?? "cmd");
      } else {
        setCurrent(line.text.slice(0, ci));
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [open, reduced]);

  // Keep the feed pinned to the bottom as it types
  useEffect(() => {
    const pre = scrollRef.current;
    if (pre) pre.scrollTop = pre.scrollHeight;
  }, [rendered, current]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="crt fixed inset-0 z-[90] flex items-start justify-center bg-bg/85 p-4 pt-[10vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Titan terminal"
            initial={{ y: 28, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-[2] w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-bg/95 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-line bg-surface/80 px-4 py-2.5">
              <div className="flex items-center gap-2" aria-hidden>
                <span className="size-2.5 rounded-full bg-accent2/80" />
                <span className="size-2.5 rounded-full bg-accent/80" />
                <span className="size-2.5 rounded-full bg-fg/20" />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {"titan@portfolio: ~"}
              </span>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                data-cursor="hover"
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors duration-200 hover:border-accent hover:text-fg"
              >
                esc
              </button>
            </div>

            {/* Feed */}
            <pre
              ref={scrollRef}
              aria-live="polite"
              className="max-h-[54vh] overflow-y-auto whitespace-pre-wrap break-words p-5 font-mono text-[12.5px] leading-[1.7] md:text-[13px]"
            >
              {rendered.map((line, i) => (
                <span
                  key={`${i}-${line.text.slice(0, 8)}`}
                  className={`block ${LINE_CLASS[line.kind]}`}
                >
                  {line.text}
                </span>
              ))}
              {!done && (
                <span className={`block ${LINE_CLASS[currentKind]}`}>
                  {current}
                  <span className="terminal-cursor" aria-hidden />
                </span>
              )}
              {done && (
                <span className="mt-1 block text-muted">
                  {"$ "}
                  <span className="terminal-cursor" aria-hidden />
                </span>
              )}
            </pre>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}