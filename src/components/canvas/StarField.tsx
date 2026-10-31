"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";
import { approach, frameStep, SNAP } from "@/lib/damp";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const STAR_COUNT = 1800;
const NEAREST = 34;
const FARTHEST = 58;
/** How far the sky shifts with the pointer, in radians. Less than the planet, so it reads as distant. */
const PARALLAX = 0.035;
const PARALLAX_LAMBDA = 2.4;

/** Repeatable noise in [0, 1), so the sky is the same on every load. */
function seeded(index: number) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const positions = new Float32Array(STAR_COUNT * 3);
const colors = new Float32Array(STAR_COUNT * 3);

for (let i = 0; i < STAR_COUNT; i++) {
  const height = seeded(i) * 2 - 1;
  const around = seeded(i + STAR_COUNT) * Math.PI * 2;
  const ring = Math.sqrt(1 - height * height);
  const radius = NEAREST + seeded(i + STAR_COUNT * 2) * (FARTHEST - NEAREST);

  positions[i * 3] = Math.cos(around) * ring * radius;
  positions[i * 3 + 1] = height * radius;
  positions[i * 3 + 2] = Math.sin(around) * ring * radius;

  // mostly dim stars, a few bright ones, slightly warm or cool
  const brightness = 0.22 + seeded(i + STAR_COUNT * 3) ** 3 * 0.78;
  const warmth = seeded(i + STAR_COUNT * 4) * 0.16;
  colors[i * 3] = brightness * (0.92 + warmth);
  colors[i * 3 + 1] = brightness * 0.96;
  colors[i * 3 + 2] = brightness * (1.08 - warmth);
}

export function StarField() {
  const stars = useRef<Points>(null);

  useFrame((state, delta) => {
    if (!stars.current) return;

    const { prefersReducedMotion } = usePortfolioStore.getState();
    const lambda = prefersReducedMotion ? SNAP : PARALLAX_LAMBDA;
    const dt = frameStep(delta);
    const reach = prefersReducedMotion ? 0 : PARALLAX;
    const wantedX = -state.pointer.y * reach;
    const wantedY = state.pointer.x * reach;

    const { rotation } = stars.current;
    rotation.x = approach(rotation.x, wantedX, lambda, dt);
    rotation.y = approach(rotation.y, wantedY, lambda, dt);

    if (rotation.x !== wantedX || rotation.y !== wantedY) state.invalidate();
  });

  return (
    <points ref={stars} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.6}
        sizeAttenuation={false}
        vertexColors
        toneMapped={false}
        depthWrite={false}
      />
    </points>
  );
}
