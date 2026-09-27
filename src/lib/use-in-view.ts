"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is in the viewport — used to gate always-on
 * compositing work (pulse animations, etc.) to only when visible.
 * rootMargin lets us start slightly before the element enters.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true); // SSR / unsupported — just render it
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px", threshold: 0, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}
