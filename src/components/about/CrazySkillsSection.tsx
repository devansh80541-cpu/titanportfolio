"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  Zap,
  Code2,
  Boxes,
  Flame,
  Globe,
  Palette,
  LayoutGrid,
  Workflow,
  FileCode2,
  Component,
  Command,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { EASE_EXPO } from "@/lib/utils";

interface SkillItem {
  name: string;
  category: "motion" | "frontend" | "tools";
  level: number;
  icon: LucideIcon;
  desc: string;
}

const SKILLS_DATA: SkillItem[] = [
  { name: "Three.js", category: "motion", level: 92, icon: Boxes, desc: "3D scene graph, cameras & WebGL rendering pipelines" },
  { name: "WebGL", category: "motion", level: 88, icon: Zap, desc: "Custom GLSL fragment & vertex shaders" },
  { name: "GSAP", category: "motion", level: 98, icon: Sparkles, desc: "ScrollTrigger & complex choreographed timelines" },
  { name: "Framer Motion", category: "motion", level: 95, icon: Workflow, desc: "Physics-based spring layout & gesture dynamics" },
  { name: "TypeScript", category: "frontend", level: 96, icon: FileCode2, desc: "Strict static typing & generic architectural patterns" },
  { name: "React", category: "frontend", level: 98, icon: Component, desc: "Concurrent Mode, hooks & Server Components" },
  { name: "Next.js", category: "frontend", level: 94, icon: Command, desc: "App Router, SSR & static site optimization" },
  { name: "Vue", category: "frontend", level: 85, icon: Layers, desc: "Reactivity system & Composition API" },
  { name: "Svelte", category: "frontend", level: 86, icon: Flame, desc: "Compiler-driven reactive UI components" },
  { name: "Tailwind CSS", category: "frontend", level: 95, icon: Palette, desc: "Design system tokens & utility architecture" },
  { name: "Node.js", category: "tools", level: 88, icon: Cpu, desc: "Asynchronous runtime & serverless APIs" },
  { name: "GraphQL", category: "tools", level: 84, icon: Code2, desc: "Schema stitching & declarative queries" },
  { name: "Lenis", category: "motion", level: 95, icon: Zap, desc: "Smooth inert scroll orchestration" },
  { name: "Astro", category: "frontend", level: 90, icon: Flame, desc: "Zero-JS island architecture" },
  { name: "Figma", category: "tools", level: 92, icon: LayoutGrid, desc: "Tokens, auto-layout & UI prototyping" },
  { name: "Webflow", category: "tools", level: 82, icon: Globe, desc: "Visual CSS architecture & CMS setup" },
];

export default function CrazySkillsSection() {
  const [activeTab, setActiveTab] = useState<"all" | "motion" | "frontend" | "tools">("all");
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [viewMode, setViewMode] = useState<"quantum" | "grid">("quantum");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monochromatic Graphite Neural Canvas Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Monochromatic graphite particle nodes
    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 1,
      });
    }

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle nodes & links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244, 244, 240, 0.4)";
        ctx.fill();

        // Connect to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = "rgba(244, 244, 240, 0.25)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Connect to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p2.x - p.x;
          const pdy = p2.y - p.y;
          const pdist = Math.hypot(pdx, pdy);

          if (pdist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const filteredSkills = useMemo(() => {
    if (activeTab === "all") return SKILLS_DATA;
    return SKILLS_DATA.filter((s) => s.category === activeTab);
  }, [activeTab]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-3xl border border-line bg-bg/95 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full opacity-50" />

      {/* Theme Ambient Glows */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent/5 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-fg/5 blur-3xl" />

      {/* Header & Controls */}
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <Sparkles className="size-4 text-accent" />
            <span>Technical Capabilities & Stack · 技能マトリックス</span>
          </div>
          <h3 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight md:text-5xl text-fg">
            Skill & <span className="text-muted">Toolkit</span>
          </h3>
        </div>

        {/* View Mode Toggle & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-line bg-bg/80 p-1 backdrop-blur-md">
            {[
              { id: "all", ja: "全" },
              { id: "motion", ja: "動作" },
              { id: "frontend", ja: "前端" },
              { id: "tools", ja: "道具" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as "all" | "motion" | "frontend" | "tools")}
                className={`relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === cat.id ? "text-bg font-bold" : "text-muted hover:text-fg"
                }`}
              >
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="skillTabPill"
                    className="absolute inset-0 rounded-full bg-fg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {cat.id} <span className="text-[10px] opacity-70 font-mono">({cat.ja})</span>
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setViewMode((v) => (v === "quantum" ? "grid" : "quantum"))}
            className="flex items-center gap-2 rounded-full border border-line bg-line/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fg transition-all duration-300 hover:border-fg hover:bg-fg/5"
          >
            <Wrench className="size-3.5 text-accent" />
            <span>{viewMode === "quantum" ? "Grid View · 格子" : "Orbit View · 軌道"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Skills Display */}
      <div className="relative z-10 mt-10 min-h-[340px]">
        {viewMode === "quantum" ? (
          /* QUANTUM ORBIT CLOUD MODE */
          <motion.div
            layout
            className="flex flex-wrap items-center justify-center gap-4 py-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, index) => (
                <SkillQuantumBadge
                  key={skill.name}
                  skill={skill}
                  index={index}
                  onHover={setHoveredSkill}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* MATRIX GRID MODE */
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, index) => (
                <SkillGridCard
                  key={skill.name}
                  skill={skill}
                  index={index}
                  onHover={setHoveredSkill}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* HUD Active Skill Inspector Banner */}
      <div className="relative z-10 mt-8 min-h-[72px] rounded-2xl border border-line bg-line/30 p-4 backdrop-blur-md">
        <AnimatePresence mode="wait">
          {hoveredSkill ? (
            <motion.div
              key={hoveredSkill.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex size-10 items-center justify-center rounded-xl border border-line bg-fg/5 text-fg shadow-inner">
                  <hoveredSkill.icon className="size-5 text-accent" />
                </span>
                <div>
                  <h4 className="font-display text-base font-bold uppercase tracking-wide text-fg">
                    {hoveredSkill.name}
                  </h4>
                  <p className="text-xs text-muted">{hoveredSkill.desc}</p>
                </div>
              </div>

              {/* Master Level Gauge */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-muted">Proficiency</span>
                  <span className="font-display text-lg font-extrabold text-fg">{hoveredSkill.level}%</span>
                </div>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-line">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${hoveredSkill.level}%` }}
                    transition={{ duration: 0.6, ease: EASE_EXPO }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full items-center justify-center gap-2 text-center text-xs uppercase tracking-widest text-muted"
            >
              <Terminal className="size-4 text-accent" />
              <span>Hover over any skill to inspect telemetry & details</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Quantum Badge Component with Theme-Matching Palette */
function SkillQuantumBadge({
  skill,
  index,
  onHover,
}: {
  skill: SkillItem;
  index: number;
  onHover: (s: SkillItem | null) => void;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const IconComponent = skill.icon;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    onHover(null);
  }

  return (
    <motion.div
      ref={badgeRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(skill)}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer"
    >
      <div className="relative flex items-center gap-3 rounded-full border border-line bg-bg/90 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-fg transition-all duration-300 group-hover:scale-105 group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
        <IconComponent className="size-4 text-accent transition-colors duration-300 group-hover:text-bg" />
        <span>{skill.name}</span>
      </div>
    </motion.div>
  );
}

/** Skill Grid Card with Theme Matching Bar */
function SkillGridCard({
  skill,
  index,
  onHover,
}: {
  skill: SkillItem;
  index: number;
  onHover: (s: SkillItem | null) => void;
}) {
  const IconComponent = skill.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onMouseEnter={() => onHover(skill)}
      onMouseLeave={() => onHover(null)}
      className="group relative overflow-hidden rounded-2xl border border-line bg-bg/80 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-fg hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl border border-line bg-line/30 text-accent transition-colors duration-300 group-hover:bg-fg group-hover:text-bg">
            <IconComponent className="size-4.5" />
          </span>
          <div>
            <h4 className="font-display font-bold uppercase tracking-wide text-fg">{skill.name}</h4>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{skill.category}</span>
          </div>
        </div>
        <span className="font-display text-sm font-extrabold text-fg">{skill.level}%</span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 0.8, delay: 0.1 + index * 0.04 }}
          className="h-full rounded-full bg-accent"
        />
      </div>
    </motion.div>
  );
}
