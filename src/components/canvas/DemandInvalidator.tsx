"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { usePortfolioStore } from "@/store/usePortfolioStore";

/**
 * Wakes the demand loop for input that lives outside React-Three-Fiber: store changes
 * from the DOM, and the pointer (which `useFrame` reads as `state.pointer`).
 *
 * React prop changes already invalidate by themselves. Anything that settles after the
 * wake-up keeps the loop going by calling `state.invalidate()` from its own `useFrame`.
 * Once everything has arrived the canvas stops rendering.
 */
export function DemandInvalidator() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const wake = () => invalidate();
    const unsubscribe = usePortfolioStore.subscribe(wake);
    window.addEventListener("pointermove", wake, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener("pointermove", wake);
    };
  }, [invalidate]);

  return null;
}
