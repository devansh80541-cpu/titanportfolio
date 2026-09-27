"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, play, setSoundEnabled } from "@/lib/sound";

/**
 * Sonic UI mute toggle — persists to localStorage. Icon pops with a
 * spring on flip (mirrors ThemeToggle), and a confirmation blip plays
 * when switching sound ON.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isSoundEnabled());
  }, []);

  return (
    <button
      onClick={() => {
        const next = !on;
        setOn(next);
        setSoundEnabled(next);
        if (next) play("toggle");
      }}
      aria-label={on ? "Mute Paparazzi background music" : "Unmute Paparazzi background music"}
      title={on ? "Mute Paparazzi & Sounds" : "Play Paparazzi & Sounds"}
      aria-pressed={on}
      data-cursor="hover"
      className="theme-fade relative grid size-9 place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-accent hover:text-fg active:scale-95"
    >
      <motion.span
        key={String(on)}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="grid place-items-center"
      >
        {on ? (
          <Volume2 className="size-4 text-accent" />
        ) : (
          <VolumeX className="size-4" />
        )}
      </motion.span>
    </button>
  );
}