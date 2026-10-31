import { useEffect } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

/** How long after the last input the scene keeps running before it eases to rest. */
const IDLE_AFTER_MS = 12_000;

const INPUT_EVENTS = [
  "pointermove",
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
] as const;

/**
 * Drives the store's `isEngaged`. The store only hears about changes between engaged and
 * idle, so a stream of pointer events never touches React.
 */
export function useEngagement() {
  useEffect(() => {
    const { setEngaged } = usePortfolioStore.getState();
    let idleTimer: number | undefined;

    const onActivity = () => {
      window.clearTimeout(idleTimer);
      if (document.hidden) {
        setEngaged(false);
        return;
      }
      setEngaged(true);
      idleTimer = window.setTimeout(() => setEngaged(false), IDLE_AFTER_MS);
    };

    onActivity();
    INPUT_EVENTS.forEach((name) =>
      window.addEventListener(name, onActivity, { passive: true }),
    );
    document.addEventListener("visibilitychange", onActivity);

    return () => {
      window.clearTimeout(idleTimer);
      INPUT_EVENTS.forEach((name) =>
        window.removeEventListener(name, onActivity),
      );
      document.removeEventListener("visibilitychange", onActivity);
    };
  }, []);
}
