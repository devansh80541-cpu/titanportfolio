"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/use-theme";

/**
 * Sun/Moon toggle — flips the site between dark graphite and light
 * editorial mode. Persists to localStorage. The icon morphs with
 * a spring rotation so the change feels tactile.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor="hover"
      className="theme-fade relative grid size-9 place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-accent hover:text-fg active:scale-95"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 90, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {isDark ? (
          <Sun className="size-4 text-accent" />
        ) : (
          <Moon className="size-4 text-accent" />
        )}
      </motion.div>
    </button>
  );
}
