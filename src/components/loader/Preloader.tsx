"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { EASE_EXPO } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const MIN_DISPLAY = 1300; // ms — never flash shorter than this
const HARD_CAP = 4000; // ms — never hold the overlay longer than this
const SEEN_KEY = "titan-preloader-seen";

/**
 * Themed entry preloader.
 *
 * The SSRed overlay paints with the HTML so the first frame loads straight
 * into the loader. It hides once the window `load` event has fired AND the
 * minimum display time elapsed (hard-capped so slow/missing load events
 * can never trap the user). On repeat visits in the same session the
 * layout effect unmounts it before paint — zero flash on client nav.
 */
export default function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const minElapsed = useRef(false);
  const loadFired = useRef(false);

  // Session gate — hides before first paint on repeat in-session visits.
  useLayoutEffect(() => {
    if (!visible) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) {
        setVisible(false);
        return;
      }
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode / storage blocked — just show it every time.
    }
  }, [visible]);

  // Hide when the page is ready — but never faster than MIN_DISPLAY.
  useEffect(() => {
    if (!visible) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const tryHide = () => {
      if (minElapsed.current && loadFired.current) setVisible(false);
    };

    const minTimer = window.setTimeout(() => {
      minElapsed.current = true;
      tryHide();
    }, reduced ? 600 : MIN_DISPLAY);

    const capTimer = window.setTimeout(() => setVisible(false), HARD_CAP);

    const onLoad = () => {
      loadFired.current = true;
      tryHide();
    };
    if (document.readyState === "complete") {
      loadFired.current = true;
      tryHide();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(capTimer);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = prevOverflow;
    };
  }, [visible, reduced]);

  return (
    <>
      <noscript>
        <style>{`.preloader{display:none!important}`}</style>
      </noscript>

      <AnimatePresence>
        {visible && (
          <motion.div
            role="status"
            aria-label="Loading portfolio"
            className="preloader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.03,
              transition: { duration: reduced ? 0.3 : 0.7, ease: EASE_EXPO },
            }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="preloader__stage"
              exit={{
                opacity: 0,
                y: -28,
                scale: 0.96,
                transition: {
                  duration: reduced ? 0.25 : 0.55,
                  ease: EASE_EXPO,
                  delay: 0.04,
                },
              }}
            >
              <div className="loader" aria-hidden="true">
                <div className="inner one" />
                <div className="inner two" />
                <div className="inner three" />
              </div>

              <div className="preloader__brand">
                <span>{site.name.toUpperCase()}</span>
                <p className="preloader__meta">
                  <span className="preloader__dot" aria-hidden="true" />
                  Loading experience
                </p>
                <div className="preloader__progress" aria-hidden="true">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: reduced ? 0.75 : 1 }}
                    transition={{
                      duration: reduced ? 0.4 : 2.8,
                      ease: "linear",
                    }}
                  />
                </div>
              </div>

              <span className="sr-only">
                Loading {site.name}&apos;s portfolio
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}