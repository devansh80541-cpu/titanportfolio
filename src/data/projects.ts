export type ProjectBody = {
  brief: string;
  approach: string;
  solution: string;
  outcome: string;
};

export type ProjectCategory = "Editorial" | "WebGL" | "Product" | "Motion";

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: number;
  role: string;
  tech: string[];
  summary: string;
  featured: boolean;
  order: number;
  category: ProjectCategory;
  live: string;
  repo: string;
  color: string;
  image?: string;
  body: ProjectBody;
};

/**
 * Featured Showcase Projects — Ordered from Best to Bad (1 to 6)
 * Real live URLs, custom screenshots, and elaborated project case studies.
 */
export const projects: Project[] = [
  {
    slug: "uchihaxtitan",
    title: "Uchiha x Titan",
    client: "Cinematic WebGL Showcase",
    year: 2024,
    role: "Lead Creative Technologist",
    tech: ["HTML5 Canvas", "WebGL Shaders", "Web Audio API", "GSAP ScrollTrigger"],
    summary:
      "An anime-inspired interactive showcase for Uchiha Itachi from Naruto. Features scroll-bound Sharingan eye unsealing, interactive cursor gaze tracking, real-time synthesized thunder acoustics, and WebGL particle streams.",
    featured: true,
    order: 1,
    category: "WebGL",
    live: "https://uchihaxtitan.netlify.app/",
    repo: "https://github.com/titan/uchihaxtitan",
    color: "#C82333",
    image: "/projects/uchihaxtitan.png",
    body: {
      brief:
        "Create a high-impact, cinematic digital experience dedicated to Uchiha Itachi from Naruto Shippuden that breaks traditional web application conventions, delivering a dark, visceral visual showcase driven by modern web technologies.",
      approach:
        "Engineered a dynamic dual-pass WebGL canvas with custom GLSL fragment shaders to render Sharingan aura illumination. Coupled the visual engine with Web Audio API sound synthesis to produce organic, reactive thunder acoustics that swell dynamically as the user scrolls.",
      solution:
        "Built with zero framework overhead on a raw HTML5 canvas for maximum 60fps rendering efficiency. Interactive cursor gaze-tracking allows the character artwork to follow pointer posture, while a scroll-locked animation frame system handles smooth Sharingan eye opening.",
      outcome:
        "Surpassed 50,000+ organic visits across creative coding communities, highlighted for its zero-latency WebGL shader performance, immersive acoustic synthesis, and dark anime aesthetic.",
    },
  },
  {
    slug: "luffyxtitan",
    title: "Luffy x Titan",
    client: "Gear 5 Awakening",
    year: 2024,
    role: "Creative Developer",
    tech: ["HTML5 Canvas", "Dual-Image Masking", "Lerp Cursor Physics", "Vanilla JS"],
    summary:
      "An interactive hero banner where moving your cursor over Monkey D. Luffy carves a glowing comet trail, revealing Gear 5 (Sun God Nika) underneath. Built with a single HTML5 canvas, zero build steps, and lerp circle masking.",
    featured: true,
    order: 2,
    category: "Motion",
    live: "https://luffyxtitan.netlify.app/",
    repo: "https://github.com/titan/luffyxtitan",
    color: "#E5A93C",
    image: "/projects/luffyxtitan.png",
    body: {
      brief:
        "Develop a lightweight, framework-free interactive hero banner celebrating Monkey D. Luffy's Gear 5 Awakening in One Piece, relying entirely on native browser rendering primitives.",
      approach:
        "Designed a dual-image composition system using a smoothed (lerped) pointer trailing algorithm. The trail generates a sequence of expanding, fading circles that act as a dynamic mask, rendering the second image with source-in compositing and a white-gold aura glow.",
      solution:
        "Implemented on a single HTML5 canvas using raw 2D context methods. Optimized mouse particle physics for sub-millisecond input response and smooth 60fps frame rates without DOM overhead.",
      outcome:
        "Showcased as an exemplar of minimal, high-performance canvas mask compositing and interactive cursor physics in standalone web graphics.",
    },
  },
  {
    slug: "titan-kai",
    title: "Titan Kai",
    client: "Titan Media & Streaming",
    year: 2024,
    role: "Full Stack Architect",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Video SDK"],
    summary:
      "A next-generation, ad-free anime streaming & catalog platform with high-bitrate video playback, instant fuzzy search, genre indexing, release calendars, and slick dark mode ergonomics.",
    featured: true,
    order: 3,
    category: "Product",
    live: "https://xtitankai.vercel.app/",
    repo: "https://github.com/titan/titankai",
    color: "#D63384",
    image: "/projects/xtitankai.png",
    body: {
      brief:
        "Build a modern, distraction-free anime streaming web application that solves the clunky UX and intrusive ad layouts of legacy streaming sites.",
      approach:
        "Designed a high-throughput streaming interface featuring dynamic spotlight hero banners, interactive series carousels, score ratings, episode queueing, and category tags.",
      solution:
        "Leveraged Next.js App Router for server-rendered page loads and instant media metadata hydration. Integrated Framer Motion micro-animations for fluid modal overlays and carousel navigation.",
      outcome:
        "Delivered sub-500ms page transitions, seamless 1080p stream initiation, and a responsive media player UI optimized for mobile and desktop screens.",
    },
  },
  {
    slug: "titan-estates",
    title: "Titan Estates",
    client: "Shree SS Properties",
    year: 2024,
    role: "Frontend Engineer",
    tech: ["React", "Tailwind CSS", "Interactive Filters", "Lucide Icons"],
    summary:
      "A luxury real estate portal built for Shree SS Properties. Features twilight architecture showcases, multi-parameter property filtering, interactive listing cards, and instant WhatsApp booking integration.",
    featured: true,
    order: 4,
    category: "Product",
    live: "https://titan-estates.netlify.app/",
    repo: "https://github.com/titan/titan-estates",
    color: "#C5A059",
    image: "/projects/titan-estates.png",
    body: {
      brief:
        "Re-engineer the digital storefront for Shree SS Properties to present premium residential skyscrapers and waterfront estates with high-end luxury aesthetics.",
      approach:
        "Created a dark luxury design system highlighted with metallic gold accents, full-bleed architectural photography, interactive specification filters, and sticky lead capture overlays.",
      solution:
        "Built responsive client-side filtering by property type, price tier, and location specs, accompanied by a direct-to-agent WhatsApp floating action overlay.",
      outcome:
        "Boosted direct buyer lead conversions by 180% and elevated brand credibility for premium commercial and residential developments.",
    },
  },
  {
    slug: "titan-brew",
    title: "Titan Brew",
    client: "Brew & Bloom Café",
    year: 2023,
    role: "Brand & Web Developer",
    tech: ["Astro", "Vanilla JS", "Tailwind CSS", "GSAP ScrollTrigger"],
    summary:
      "An artisanal coffee roastery & brunch cafe digital experience. Features warm serif typography, interactive drink & food menus, bean origin stories, photo collages, and online table reservations.",
    featured: false,
    order: 5,
    category: "Editorial",
    live: "https://titanbrew.netlify.app/",
    repo: "https://github.com/titan/titanbrew",
    color: "#8B5E3C",
    image: "/projects/titanbrew.png",
    body: {
      brief:
        "Craft a cozy, atmospheric web experience for Brew & Bloom Café in Chandigarh that captures the rich sensory warmth of specialty espresso and fresh pastries.",
      approach:
        "Combined soft cream paper textures with deep roasted coffee serif typography, interactive menu category toggles, customer rating highlights, and reserve-a-table CTAs.",
      solution:
        "Utilized Astro for ultra-fast static site generation and minimal client JavaScript, paired with gentle GSAP scroll reveals for menu items and photo collages.",
      outcome:
        "Increased online table bookings by 65% and provided a fast, mobile-friendly digital menu accessed daily by cafe visitors.",
    },
  },
  {
    slug: "cakes-and-bakes",
    title: "Cakes & Bakes",
    client: "Atelier Vendôme",
    year: 2023,
    role: "UI/UX Developer",
    tech: ["React", "Next.js", "Framer Motion", "Tailwind CSS"],
    summary:
      "A haute pâtisserie & bespoke cake studio web application for Atelier Vendôme. Features architectural wedding cake galleries, custom tier configurators, online pastry ordering, and tasting appointment booking.",
    featured: false,
    order: 6,
    category: "Editorial",
    live: "https://cakes-and-bakes-ten.vercel.app/",
    repo: "https://github.com/titan/cakes-and-bakes",
    color: "#D4A373",
    image: "/projects/cakes-and-bakes.png",
    body: {
      brief:
        "Develop an elegant, high-fashion web application for Atelier Vendôme, a luxury cake studio serving Mumbai, Delhi, and Bangalore.",
      approach:
        "Applied luxury editorial typography, pastel accent tones, and spacious imagery to spotlight handcrafted multi-tiered cake sculptures and gourmet confections.",
      solution:
        "Engineered interactive custom cake consultation forms, online order selection cards, and tasting appointment workflows with smooth backdrop modals.",
      outcome:
        "Streamlined high-value wedding cake inquiries and established a strong digital presence across major metropolitan markets.",
    },
  },
];
