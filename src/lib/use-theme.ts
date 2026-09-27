"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "titan-theme";
const MANUAL_KEY = "titan-theme-manual";

/**
 * Theme state with localStorage persistence + system-preference fallback.
 * Returns the active theme and a toggle. The scroll-triggered section
 * theme swap reads `data-manual` from <html> and skips its swap when
 * the user has manually chosen a mode — the manual choice always wins.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Hydrate from localStorage or system preference on mount
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
      return;
    }
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    const initial: Theme = prefersLight ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      document.documentElement.dataset.manual = "true";
      window.localStorage.setItem(STORAGE_KEY, next);
      window.localStorage.setItem(MANUAL_KEY, "true");
      return next;
    });
  }, []);

  return { theme, toggle };
}

/** Non-React helper — scroll-triggered swaps call this before overriding. */
export function isManualTheme(): boolean {
  return document.documentElement.dataset.manual === "true";
}
