# TITAN FX — Interactive Portfolio Engine

Editorial, Awwwards-grade portfolio for **Titan** — Senior Frontend Engineer & Creative Coder.

Built to a strict creative-technology spec: Lenis inertia scroll, GSAP ScrollTrigger choreography, Framer Motion physics (custom magnetic cursor, 3D card tilt), kinetic clip-mask typography, and a graphite/alabaster theme system that swaps mid-scroll.

**FX layer:** cursor particle field with click shockwaves + a confetti event bus, a Web Audio synth UI sound engine (no audio files; mute toggle in the nav), and easter eggs — type **party** anywhere for crazy mode (rainbow palette + confetti), press **`** for a typed CRT terminal that dumps real site data, and a cinematic CRT 404 page.

**Performance budget:** the particle canvas self-sleeps when the pointer rests and caps DPR at 1.5; the hero WebGL loop freezes entirely while the hero is off-screen (shadow maps removed, DPR capped); the route-transition wrapper drops its `filter`/`transform` layer the moment the entrance settles so scrolling never runs through a full-page filter pass.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **Framer Motion** — cursor physics, springs, layout animations
- **GSAP + ScrollTrigger** — pinned horizontal timeline, scrub reveals
- **Lenis** — inertia smooth scroll synced to GSAP's ticker
- **Lucide React** — icons

## Run it

This machine has no Node/npm — use **Bun**:

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # production build + type check
bun run start    # serve production build
```

## Structure

```
src/
  app/            # App Router shell, global CSS, layout, page
  components/
    background/   # ambient film grain
    cursor/       # MagneticCursor (physics) + Magnetic wrapper + particle field
    fx/           # FXLayer · PartyMode (type "party") · TerminalEasterEgg (`)
    experience/   # pinned horizontal timeline
    footer/       # giant email, socials, live IST clock
    hero/         # kinetic landing
    nav/          # floating island bar
    providers/    # Lenis ↔ GSAP sync
    typography/   # KineticText, ScrubFade
    works/        # filter grid, 3D tilt cards, case-study modal
  data/           # site config + projects (single source of truth)
  lib/            # gsap registration, lenis singleton, motion tokens
```

## Personalize

Edit `src/data/site.ts` (identity, socials, timeline, skills) and `src/data/projects.ts` (case studies). Colors/motion tokens live in `src/app/globals.css` and `src/lib/utils.ts`.
