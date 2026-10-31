"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { SECTIONS } from "@/config/sections";
import { approach, approachVector, frameStep, SNAP } from "@/lib/damp";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const POSITION_LAMBDA = 1.9;
const TARGET_LAMBDA = 2.2;
/** Camera distance multiplier while a project is open. */
const PROJECT_ZOOM = 0.92;

// Scratch vectors, allocated once and reused every frame.
const wantedPosition = new Vector3();
const wantedTarget = new Vector3();

/** Flies the camera to the pose of the active section, easing there. */
export function CameraRig() {
  const roll = useRef(0);

  // The smoothed look-at point. The camera chases it rather than snapping to the target.
  const lookTarget = useMemo(
    () => new Vector3(...SECTIONS.home.camera.target),
    [],
  );

  useFrame((state, delta) => {
    const { activeSection, selectedProjectId, prefersReducedMotion } =
      usePortfolioStore.getState();
    const pose = SECTIONS[activeSection].camera;

    wantedTarget.set(...pose.target);
    wantedPosition
      .set(...pose.position)
      .sub(wantedTarget)
      .multiplyScalar(selectedProjectId ? PROJECT_ZOOM : 1)
      .add(wantedTarget);

    const dt = frameStep(delta);
    const movingPosition = approachVector(
      state.camera.position,
      wantedPosition,
      prefersReducedMotion ? SNAP : POSITION_LAMBDA,
      dt,
    );
    const movingTarget = approachVector(
      lookTarget,
      wantedTarget,
      prefersReducedMotion ? SNAP : TARGET_LAMBDA,
      dt,
    );
    roll.current = approach(
      roll.current,
      pose.roll,
      prefersReducedMotion ? SNAP : TARGET_LAMBDA,
      dt,
    );

    state.camera.up.set(Math.sin(roll.current), Math.cos(roll.current), 0);
    state.camera.lookAt(lookTarget);

    // keep the demand loop alive until the camera has arrived
    if (movingPosition || movingTarget || roll.current !== pose.roll) {
      state.invalidate();
    }
  });

  return null;
}
