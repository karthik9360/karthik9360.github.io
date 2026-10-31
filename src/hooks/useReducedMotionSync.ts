import { useEffect } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

/** Keeps the store's `prefersReducedMotion` in step with the OS setting. */
export function useReducedMotionSync() {
  useEffect(() => {
    const { setPrefersReducedMotion } = usePortfolioStore.getState();
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
}
