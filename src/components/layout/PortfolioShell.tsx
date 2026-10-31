"use client";

import dynamic from "next/dynamic";
import { useState, type CSSProperties } from "react";
import { CanvasBoundary } from "@/components/canvas/CanvasBoundary";
import { SectionNav } from "@/components/overlay/SectionNav";
import { SectionPanels } from "@/components/overlay/SectionPanels";
import { SECTIONS } from "@/config/sections";
import { profile } from "@/data/profile";
import { useEngagement } from "@/hooks/useEngagement";
import { useReducedMotionSync } from "@/hooks/useReducedMotionSync";
import { usePortfolioStore } from "@/store/usePortfolioStore";

// WebGL needs a browser, so the canvas chunk is never rendered on the server.
const SceneCanvas = dynamic(() => import("@/components/canvas/SceneCanvas"), {
  ssr: false,
});

/**
 * Master layout. The scene is the background of the whole page, with the content centred
 * on top of it. Three layers share one full-screen stacking context:
 *
 *   z-10  fixed WebGL canvas   (aria-hidden, decorative)
 *   z-20  hero scrim           (pointer-events: none, Home only)
 *   z-30  DOM content          (pointer-events: none, re-enabled on interactive parts)
 *
 * The two layers talk only through `usePortfolioStore`.
 */
export function PortfolioShell() {
  const activeSection = usePortfolioStore((state) => state.activeSection);
  const isSceneReady = usePortfolioStore((state) => state.isSceneReady);
  const goTo = usePortfolioStore((state) => state.goTo);

  // R3F listens for pointer events on this element, so the scene still sees the pointer
  // while it is over the DOM layer. State rather than a ref, so the canvas mounts only
  // once the element exists.
  const [shell, setShell] = useState<HTMLDivElement | null>(null);

  useReducedMotionSync();
  useEngagement();

  return (
    <div
      ref={setShell}
      data-section={activeSection}
      style={{ "--accent": SECTIONS[activeSection].accent } as CSSProperties}
      className="accent-shell light-pool relative h-dvh w-full overflow-hidden bg-ink text-ice"
    >
      {/* Layer 0: the scene. Fades in once ready; if WebGL never starts, the dark page stays. */}
      <div
        aria-hidden="true"
        data-ready={isSceneReady}
        className="fixed inset-0 z-10 opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100 motion-reduce:transition-none"
      >
        {shell && (
          <CanvasBoundary>
            <SceneCanvas eventSource={shell} />
          </CanvasBoundary>
        )}
      </div>

      {/* Layer 1: dims the centre of the scene behind the hero text */}
      <div
        aria-hidden="true"
        data-visible={activeSection === "home"}
        className="hero-scrim pointer-events-none fixed inset-0 z-20 transition-opacity duration-700 data-[visible=false]:opacity-0 motion-reduce:transition-none"
      />

      {/* Layer 2: content */}
      <div className="pointer-events-none relative z-30 flex h-full flex-col">
        <header className="pointer-events-auto flex items-center justify-between px-5 py-4 lg:px-12 lg:py-6">
          <button
            type="button"
            onClick={() => goTo("home")}
            aria-label="Home"
            className="font-expanded flex h-10 items-center text-sm font-medium"
          >
            <span className="sm:hidden">MK</span>
            <span className="hidden sm:inline">{profile.name}</span>
          </button>
          <div className="flex items-center gap-4">
            <SectionNav />
            <a
              href={profile.resume}
              download
              className="rounded-full border border-white/20 px-4 py-2 text-[0.8125rem] font-medium transition-colors hover:border-accent"
            >
              Resume
            </a>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 items-center justify-center px-4 pb-18 lg:px-12 lg:pb-8">
          <SectionPanels />
        </main>
      </div>
    </div>
  );
}
