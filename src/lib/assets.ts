import { useTexture } from "@react-three/drei";

/**
 * Earth maps, served from /public. NASA Blue Marble and Black Marble imagery by way of
 * the MIT-licensed three-globe package, compressed to WebP.
 *
 * To add a glTF model later, list it here too and call `useGLTF.preload` for it below.
 */
export const TEXTURES = {
  day: "/textures/earth-day.webp",
  night: "/textures/earth-night.webp",
  water: "/textures/earth-water.webp",
  clouds: "/textures/earth-clouds.webp",
};

/** Starts the downloads as soon as the canvas chunk loads, before anything asks for them. */
export function preloadAssets() {
  useTexture.preload(Object.values(TEXTURES));
}
