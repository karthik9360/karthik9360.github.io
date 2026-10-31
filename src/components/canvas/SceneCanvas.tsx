"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Scene } from "@/components/canvas/Scene";
import { SECTIONS } from "@/config/sections";
import { preloadAssets } from "@/lib/assets";
import { usePortfolioStore } from "@/store/usePortfolioStore";

// Runs when this chunk loads, so downloads overlap with the renderer starting up.
preloadAssets();

/** Cap on the render-resolution multiplier. Fill rate grows with its square. */
const MAX_DPR = 1.75;
const SPACE = "#050811";

/** Mounts inside the Suspense boundary, so it only runs once `<Preload>` has finished. */
function ReadySignal() {
  useEffect(() => {
    const { setSceneReady } = usePortfolioStore.getState();
    setSceneReady(true);
    return () => setSceneReady(false);
  }, []);

  return null;
}

interface SceneCanvasProps {
  /** Element that receives pointer events for the scene, so the DOM layer doesn't block them. */
  eventSource: HTMLElement;
}

export default function SceneCanvas({ eventSource }: SceneCanvasProps) {
  // Runs flat out only while someone is there to see it. When the visitor goes idle or
  // the tab hides, the loop drops to on-demand, the scene eases to rest and rendering stops.
  const frameloop = usePortfolioStore((state) =>
    state.isEngaged && !state.prefersReducedMotion ? "always" : "demand",
  );

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, MAX_DPR]}
      camera={{
        position: SECTIONS.home.camera.position,
        fov: 38,
        near: 0.1,
        far: 80,
      }}
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
      }}
      eventSource={eventSource}
      eventPrefix="client"
    >
      <color attach="background" args={[SPACE]} />
      <Suspense fallback={null}>
        <Scene />
        <Preload all />
        <ReadySignal />
      </Suspense>
    </Canvas>
  );
}
