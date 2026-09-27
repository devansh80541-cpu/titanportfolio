"use client";

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";

/* Gojo palette — white hair, black blindfold, pale skin, dark sorcerer uniform */
const GOJO = {
  hair: "#ECECEC",      // iconic white-silver spikes
  skin: "#F2D9D5",      // pale warm skin
  blindfold: "#0F1012", // deep black blindfold
  uniform: "#1A1B2E",   // dark navy-black jujutsu uniform
  uniformAccent: "#2A2C44", // subtle lighter accent on fabric folds
};

/**
 * Gojo 3D model with entrance animation, scroll-linked rotation,
 * mouse parallax response, and idle float.
 */
export default function GojoModel() {
  const groupRef = useRef<Group>(null);
  const targetScale = useRef(1);
  const currentScale = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const scrollY = useRef(0);

  const { scene } = useGLTF("/models/white_mesh.glb");
  const cloned = scene.clone(true) as THREE.Object3D;

  /** Paint the model by matching mesh names to Gojo's palette. */
  useEffect(() => {
    const byName = new Map<string, THREE.Mesh>();
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        byName.set(child.name, child as THREE.Mesh);
      }
    });

    const matCache = new Map<string, THREE.MeshStandardMaterial>();
    const material = (color: string, rough = 0.65, metal = 0.05) => {
      const key = `${color}-${rough}-${metal}`;
      if (!matCache.has(key)) {
        matCache.set(
          key,
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: rough,
            metalness: metal,
          })
        );
      }
      return matCache.get(key)!;
    };

    byName.forEach((mesh, name) => {
      const lower = name.toLowerCase();
      let color = GOJO.uniform;
      let rough = 0.65;
      let metal = 0.05;

      if (lower.includes("hair") || lower.includes("head")) {
        color = GOJO.hair;
        rough = 0.4;
      } else if (
        lower.includes("blindfold") ||
        lower.includes("mask") ||
        lower.includes("eye")
      ) {
        color = GOJO.blindfold;
        rough = 0.3;
        metal = 0.15;
      } else if (
        lower.includes("body") ||
        lower.includes("skin") ||
        lower.includes("face") ||
        lower.includes("hand") ||
        lower.includes("arm") ||
        lower.includes("leg")
      ) {
        color = GOJO.skin;
        rough = 0.7;
      } else if (
        lower.includes("clothes") ||
        lower.includes("uniform") ||
        lower.includes("outfit") ||
        lower.includes("torso")
      ) {
        color = GOJO.uniform;
        rough = 0.75;
      }

      mesh.material = material(color, rough, metal);
    });
  }, [cloned]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Center + normalize model height
    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    group.position.x = -center.x;
    group.position.y = -box.min.y;
    group.position.z = -center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const calculatedScale = 2.2 / maxDim;
    targetScale.current = calculatedScale;
    group.scale.setScalar(0); // Start at 0 scale for entrance animation
  }, [cloned]);

  // Listen to mouse and scroll for interactive parallax & scroll-linked rotation
  useEffect(() => {
    let mouseRaf = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRaf) return;
      mouseRaf = true;
      requestAnimationFrame(() => {
        mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
        mouseRaf = false;
      });
    };

    let scrollRaf = false;
    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = true;
      requestAnimationFrame(() => {
        scrollY.current = window.scrollY;
        scrollRaf = false;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Synchronized R3F frame loop: smooth entrance, idle float, mouse tilt, scroll rotation
  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.getElapsedTime();

    // Smooth lerp entrance scaling
    if (currentScale.current < targetScale.current) {
      currentScale.current = THREE.MathUtils.lerp(
        currentScale.current,
        targetScale.current,
        0.04
      );
      group.scale.setScalar(currentScale.current);
    }

    // Idle sine floating & breathing
    group.position.y = Math.sin(t * 1.4) * 0.08;

    // Mouse interactive tilt
    const targetRotY = -0.3 + mouseX.current * 0.35 + (scrollY.current * 0.0015);
    const targetRotX = 0.15 + mouseY.current * 0.2;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, 0.05);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, 0.05);
  });

  return (
    <group
      ref={groupRef}
      rotation={[0.15, -0.3, 0.05]}
      dispose={null}
    >
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload("/models/white_mesh.glb");
