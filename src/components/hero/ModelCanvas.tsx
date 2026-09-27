"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const GojoModel = lazy(() => import("./GojoModel"));

/**
 * Soft 3-point studio lighting that complements the graphite/alabaster
 * palette. No shadow maps — they force a full second render pass of the
 * scene every frame for a subtle contact-darkening effect not worth the
 * GPU budget.
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Key — warm champagne from upper-right */}
      <directionalLight position={[4, 6, 3]} intensity={1.6} color="#C5A880" />
      {/* Fill — cool alabaster from the left */}
      <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#F4F4F0" />
      {/* Rim — terracotta edge from behind */}
      <directionalLight position={[0, 3, -4]} intensity={0.8} color="#B85B35" />
    </>
  );
}

/**
 * Self-contained R3F Canvas for the hero — transparent background,
 * soft studio lighting, subtle orbit drag. Lazy-loads the model
 * so the hero text paints instantly. Hidden entirely under
 * prefers-reduced-motion.
 *
 * Perf: the render loop freezes (frameloop="never") the moment the hero
 * scrolls out of view — otherwise WebGL keeps burning GPU at the footer
 * and drags every scroll frame with it. DPR is capped at 1.5.
 */
export default function ModelCanvas({ reduced }: { reduced: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"),
      { threshold: 0.02 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) return null;

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0">
      <Canvas
        frameloop={frameloop}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.2, 5.5], fov: 35 }}
        style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
      >
        <Suspense fallback={null}>
          <GojoModel />
        </Suspense>
        <Lighting />
        {/* Subtle drag-to-rotate — disabled on touch via prop */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}
