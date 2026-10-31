import { Vector3 } from "three";
import { ACCENTS } from "@/components/canvas/accents";
import { SECTIONS } from "@/config/sections";

/**
 * Uniforms the globe's layers share. `World` updates this one set once a frame, and each
 * shader material holds a reference to the same `{ value }` objects.
 */
export const worldUniforms = {
  /** Unit vector toward the sun. */
  uSun: { value: new Vector3(...SECTIONS.home.sun).normalize() },
  uAccent: { value: ACCENTS.home.clone() },
  /** Seconds of ambient motion. Stands still at rest, so nothing jumps on waking. */
  uTime: { value: 0 },
  /** 1 while a project is hovered: the arcs run brighter. */
  uEnergy: { value: 0 },
  /** Point on the unit globe under the pointer. */
  uPointer: { value: new Vector3(0, 0, 1) },
  /** 1 while the pointer is over the planet. */
  uPointerGlow: { value: 0 },
};
