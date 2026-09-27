"use client";

import { isManualTheme } from "./use-theme";

/**
 * Scroll-triggered sections call this to swap the theme. If the user
 * has manually toggled (data-manual="true" on <html>), the swap is
 * skipped so the manual choice always wins.
 */
export function setThemeIfAllowed(theme: "dark" | "light") {
  if (isManualTheme()) return;
  document.documentElement.dataset.theme = theme;
}
