import { MathUtils, type Color, type Vector3 } from "three";

/**
 * Longest step, in seconds, fed into easing. On a demand loop the first frame after
 * idle reports the whole idle time as its delta; uncapped, that frame would jump
 * straight to the target instead of easing.
 */
const MAX_FRAME_STEP = 1 / 20;

/** Distance below which an eased value counts as arrived. Well under a pixel. */
const SETTLE_EPSILON = 0.002;

/** Lambda that finishes an ease within a frame. Used for `prefers-reduced-motion`. */
export const SNAP = 1000;

export const frameStep = (delta: number) => Math.min(delta, MAX_FRAME_STEP);

/**
 * Exponential ease toward `target`. Returns exactly `target` once close enough, so
 * callers can test `result !== target` to learn whether another frame is needed.
 */
export function approach(
  current: number,
  target: number,
  lambda: number,
  dt: number,
) {
  const next = MathUtils.damp(current, target, lambda, dt);
  return Math.abs(next - target) < SETTLE_EPSILON ? target : next;
}

/** Eases `current` toward `target` in place. Returns true while it is still moving. */
export function approachVector(
  current: Vector3,
  target: Vector3,
  lambda: number,
  dt: number,
) {
  current.x = approach(current.x, target.x, lambda, dt);
  current.y = approach(current.y, target.y, lambda, dt);
  current.z = approach(current.z, target.z, lambda, dt);
  return !current.equals(target);
}

/** Eases `current` toward `target` in place. Returns true while it is still moving. */
export function approachColor(
  current: Color,
  target: Color,
  lambda: number,
  dt: number,
) {
  current.r = approach(current.r, target.r, lambda, dt);
  current.g = approach(current.g, target.g, lambda, dt);
  current.b = approach(current.b, target.b, lambda, dt);
  return !current.equals(target);
}
