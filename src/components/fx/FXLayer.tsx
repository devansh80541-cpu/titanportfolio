"use client";

import { useEffect } from "react";
import CursorParticles from "@/components/cursor/CursorParticles";
import PartyMode from "@/components/fx/PartyMode";
import TerminalEasterEgg from "@/components/fx/TerminalEasterEgg";
import AnimePetals from "@/components/fx/AnimePetals";
import AnimeMangaSFX from "@/components/fx/AnimeMangaSFX";
import { initSoundGestures } from "@/lib/sound";

/**
 * Client-side FX layer mounted once in the root layout:
 *   · cursor particle field (trail, click shockwaves, confetti bus)
 *   · subtle floating petal motes in champagne/terracotta palette
 *   · manga-style SFX stamps on click (TITAN! POW! ZAP! etc.)
 *   · party-mode easter egg (type "party")
 *   · terminal easter egg (backtick)
 *   · Web Audio gesture unlock for the synth UI sound engine
 */
export default function FXLayer() {
  useEffect(() => {
    initSoundGestures();
  }, []);

  return (
    <>
      <CursorParticles />
      <AnimePetals count={2} fixed={true} />
      <AnimeMangaSFX />
      <PartyMode />
      <TerminalEasterEgg />
    </>
  );
}