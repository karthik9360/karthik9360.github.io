import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { SectionId } from "@/config/sections";

/**
 * The bridge between the DOM layer and the R3F canvas.
 *
 * DOM components call the actions. The scene never subscribes through React for
 * per-frame data: it reads `usePortfolioStore.getState()` inside `useFrame`, and
 * `DemandInvalidator` wakes the demand loop whenever anything here changes. So a
 * button press moves the camera without re-rendering any 3D component.
 */
export interface PortfolioState {
  /** Section the DOM shows and the camera frames. */
  activeSection: SectionId;
  /** Project row the pointer or keyboard focus is on. */
  hoveredProjectId: string | null;
  /** Project row opened by the visitor. */
  selectedProjectId: string | null;
  /** True once the canvas has mounted and `<Preload>` has finished. */
  isSceneReady: boolean;
  /** Mirrors `prefers-reduced-motion`; the scene snaps instead of easing. */
  prefersReducedMotion: boolean;
  /**
   * True while the tab is visible and the visitor has recently done something. The
   * canvas runs continuously only then; otherwise it eases to rest and stops rendering.
   */
  isEngaged: boolean;

  goTo: (section: SectionId) => void;
  setHoveredProject: (id: string | null) => void;
  selectProject: (id: string | null) => void;
  setSceneReady: (ready: boolean) => void;
  setPrefersReducedMotion: (reduced: boolean) => void;
  setEngaged: (engaged: boolean) => void;
}

// Module-level singleton. Safe in Next.js because it only changes in response to
// client events and effects, never during a server render.
export const usePortfolioStore = create<PortfolioState>()(
  subscribeWithSelector((set) => ({
    activeSection: "home",
    hoveredProjectId: null,
    selectedProjectId: null,
    isSceneReady: false,
    prefersReducedMotion: false,
    isEngaged: true,

    // Returning `state` unchanged tells zustand nothing happened, so no listener fires.
    goTo: (section) =>
      set((state) =>
        state.activeSection === section
          ? state
          : {
              activeSection: section,
              // project state belongs to the Projects section; don't carry it elsewhere
              hoveredProjectId: null,
              selectedProjectId: null,
            },
      ),
    setHoveredProject: (id) =>
      set((state) =>
        state.hoveredProjectId === id ? state : { hoveredProjectId: id },
      ),
    selectProject: (id) =>
      set((state) =>
        state.selectedProjectId === id ? state : { selectedProjectId: id },
      ),
    setSceneReady: (ready) =>
      set((state) =>
        state.isSceneReady === ready ? state : { isSceneReady: ready },
      ),
    setPrefersReducedMotion: (reduced) =>
      set((state) =>
        state.prefersReducedMotion === reduced
          ? state
          : { prefersReducedMotion: reduced },
      ),
    setEngaged: (engaged) =>
      set((state) =>
        state.isEngaged === engaged ? state : { isEngaged: engaged },
      ),
  })),
);
