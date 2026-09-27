/**
 * SITE CONFIG — the single source of truth.
 * Find & replace these values to personalize the site.
 */
export const site = {
  // ── Identity ──
  name: "Titan",
  initials: "T",
  role: "Frontend Architect & Creative Developer",
  tagline: "Editorial interfaces where typography, motion, and code converge.",
  location: "Bengaluru, India",
  timezone: "Asia/Kolkata", // IANA — used for the live clock
  timezoneLabel: "IST · UTC+5:30",
  yearsExp: 4,

  // ── Contact ──
  email: "titanworksfx@zohomail.in",
  emailDisplay: "titanworksfx@zohomail.in",

  // ── Socials ──
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/titan.1300/" },
    { label: "Discord", url: "https://discord.com/users/1540634218617376778" },
  ],

  // ── Career timeline (pinned horizontal section) ──
  timeline: [
    {
      year: 2020,
      label: "2020",
      role: "Junior Developer",
      org: "Pixel & Grain · Goa",
      note: "Cut my teeth shipping marketing sites for fashion and lifestyle brands — fast, scrappy, and obsessively pixel-perfect.",
      skills: ["HTML / CSS", "JavaScript", "WordPress", "Figma"],
    },
    {
      year: 2022,
      label: "2022",
      role: "Frontend Engineer",
      org: "Volta Fintech · Remote",
      note: "Product engineering at early-stage fintech: design systems, data-dense dashboards, and motion that made numbers feel alive.",
      skills: ["React", "TypeScript", "Next.js", "Node"],
    },
    {
      year: 2023,
      label: "2023",
      role: "Lead Frontend",
      org: "Studio Halftone · Mumbai",
      note: "Led the frontend guild across client work — editorial builds, WebGL experiments, and mentoring a team of four.",
      skills: ["GSAP", "Three.js", "Vue", "Team Lead"],
    },
    {
      year: 2024,
      label: "2024 — Now",
      role: "Frontend Architect",
      org: "Independent · Bengaluru",
      note: "Independent practice for studios across Mumbai, Goa, and the Bay. Typography-first interfaces, physics-based motion, shipped fast.",
      skills: ["WebGL", "Shaders", "Framer Motion", "Creative Direction"],
    },
  ],

  // ── About ──
  about: {
    intro:
      "I'm Titan — a frontend architect and creative developer based in Bengaluru with four years building editorial interfaces for studios across Mumbai, Goa, and the Bay. I work where typography, motion, and code intersect, treating each project as a piece of design that just happens to render in a browser.",
    body: [
      "My background spans agency work for fashion and lifestyle brands, product engineering at early-stage fintech, and a long, unhealthy obsession with print typography. I think the best digital work borrows the rhythm of editorial design — generous whitespace, confident type, motion that feels physical — and translates it into interactive surfaces.",
      "When I'm not shipping, I'm writing about GSAP on the side, contributing to a handful of open-source motion libraries, and maintaining a slowly growing collection of typographic specimens.",
    ],
  },

  // ── Skills ──
  skills: [
    "TypeScript", "React", "Next.js", "Astro", "Vue",
    "GSAP", "Three.js", "WebGL", "Lenis",
    "Svelte", "Framer Motion", "Tailwind", "Vite",
    "Node", "GraphQL", "Figma", "Webflow",
  ],

  // ── Resume ──
  resumeUrl: "/resume.pdf",

  // ── SEO defaults ──
  seo: {
    title: "Titan — Frontend Architect & Creative Developer",
    description:
      "Portfolio of Titan, a Bengaluru-based frontend architect & creative developer building editorial interfaces with Next.js, React, GSAP, and WebGL.",
    url: "https://titanworksfx.zohomail.in",
    locale: "en_IN",
  },
} as const;

export type SiteConfig = typeof site;
