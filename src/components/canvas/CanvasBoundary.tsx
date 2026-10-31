"use client";

import { Component, type ReactNode } from "react";

interface CanvasBoundaryProps {
  children: ReactNode;
}

interface CanvasBoundaryState {
  failed: boolean;
}

/**
 * The page reads fine without the 3D layer. If the scene throws (WebGL unavailable, a
 * bug in a scene component), drop the canvas and leave the DOM layer running instead of
 * letting React unmount the whole page.
 */
export class CanvasBoundary extends Component<
  CanvasBoundaryProps,
  CanvasBoundaryState
> {
  state: CanvasBoundaryState = { failed: false };

  static getDerivedStateFromError(): CanvasBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene disabled:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
