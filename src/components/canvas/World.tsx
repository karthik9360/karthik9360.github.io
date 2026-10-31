"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  NoColorSpace,
  Sphere,
  SRGBColorSpace,
  Vector3,
  type ColorSpace,
  type Group,
  type Texture,
} from "three";
import { ACCENTS } from "@/components/canvas/accents";
import { Atmosphere } from "@/components/canvas/Atmosphere";
import { Clouds } from "@/components/canvas/Clouds";
import { DataArcs } from "@/components/canvas/DataArcs";
import { Earth } from "@/components/canvas/Earth";
import { worldUniforms } from "@/components/canvas/worldUniforms";
import { SECTIONS } from "@/config/sections";
import { TEXTURES } from "@/lib/assets";
import {
  approach,
  approachColor,
  approachVector,
  frameStep,
  SNAP,
} from "@/lib/damp";
import { EARTH_RADIUS, facingPitch, facingYaw } from "@/lib/geo";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const TURN_LAMBDA = 1.8;
const SUN_LAMBDA = 1.6;
const TINT_LAMBDA = 3;
const AMBIENT_LAMBDA = 1.4;
const ENERGY_LAMBDA = 5;
const POINTER_LAMBDA = 6;
/** Largest pointer-driven tilt, in radians. */
const MAX_TILT = 0.1;
/** The planet sways this far, in radians, so it never looks frozen while someone is there. */
const SWAY = 0.05;
const SWAY_SPEED = 0.12;
const TAU = Math.PI * 2;

// Scratch objects, allocated once and reused every frame.
const planet = new Sphere(new Vector3(), EARTH_RADIUS);
const wantedSun = new Vector3();
const hit = new Vector3();

function prepareTexture(
  texture: Texture,
  colorSpace: ColorSpace,
  anisotropy: number,
) {
  texture.colorSpace = colorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
}

/**
 * The planet behind the page. The active section turns it and moves the sun, the pointer
 * tilts it and lights up the surface under its ray, and a hovered project sends more data
 * down the arcs. All of it is read from the store here and eased once per frame.
 */
export function World() {
  const tilt = useRef<Group>(null);
  const turn = useRef<Group>(null);
  // Shared with Clouds. 1 while engaged, easing to 0 at rest, so idle motion winds down gently.
  const ambient = useRef(0);
  const textures = useTexture(TEXTURES);
  const maxAnisotropy = useThree((state) =>
    state.gl.capabilities.getMaxAnisotropy(),
  );

  useLayoutEffect(() => {
    const anisotropy = Math.min(maxAnisotropy, 8);
    prepareTexture(textures.day, SRGBColorSpace, anisotropy);
    prepareTexture(textures.night, SRGBColorSpace, anisotropy);
    prepareTexture(textures.water, NoColorSpace, 1);
    prepareTexture(textures.clouds, NoColorSpace, anisotropy);
  }, [textures, maxAnisotropy]);

  // drei caches loaded textures and never frees them, so the GPU copies are ours to release.
  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture.dispose());
    },
    [textures],
  );

  useFrame((state, delta) => {
    if (!tilt.current || !turn.current) return;

    const { activeSection, hoveredProjectId, isEngaged, prefersReducedMotion } =
      usePortfolioStore.getState();
    const { facing, sun } = SECTIONS[activeSection];
    const dt = frameStep(delta);
    const {
      uAccent,
      uEnergy,
      uPointer,
      uPointerGlow,
      uSun,
      uTime,
    } = worldUniforms;

    ambient.current = approach(
      ambient.current,
      isEngaged && !prefersReducedMotion ? 1 : 0,
      prefersReducedMotion ? SNAP : AMBIENT_LAMBDA,
      dt,
    );
    const calm = ambient.current;
    uTime.value += dt * calm;

    const reach = prefersReducedMotion ? 0 : MAX_TILT;
    const turnLambda = prefersReducedMotion ? SNAP : TURN_LAMBDA;
    const sway = Math.sin(uTime.value * SWAY_SPEED) * SWAY * calm;

    // Go the short way round the planet, whichever side it is on now.
    const yaw = facingYaw(facing.lon);
    const wrapped = Math.round((turn.current.rotation.y - yaw) / TAU) * TAU;
    const wantedYaw = yaw + wrapped + sway + state.pointer.x * reach;
    const wantedPitch = facingPitch(facing.lat) - state.pointer.y * reach;

    turn.current.rotation.y = approach(
      turn.current.rotation.y,
      wantedYaw,
      turnLambda,
      dt,
    );
    tilt.current.rotation.x = approach(
      tilt.current.rotation.x,
      wantedPitch,
      turnLambda,
      dt,
    );

    const sunMoving = approachVector(
      uSun.value,
      wantedSun.set(...sun).normalize(),
      prefersReducedMotion ? SNAP : SUN_LAMBDA,
      dt,
    );
    const tinting = approachColor(
      uAccent.value,
      ACCENTS[activeSection],
      prefersReducedMotion ? SNAP : TINT_LAMBDA,
      dt,
    );

    const wantedEnergy = hoveredProjectId ? 1 : 0;
    uEnergy.value = approach(
      uEnergy.value,
      wantedEnergy,
      prefersReducedMotion ? SNAP : ENERGY_LAMBDA,
      dt,
    );

    // Follow the pointer's ray to the surface. The planet is a sphere, so this is one sum.
    const pointerActive = state.pointer.x !== 0 || state.pointer.y !== 0;
    const touching =
      pointerActive && state.raycaster.ray.intersectSphere(planet, hit) !== null;
    if (touching) {
      uPointer.value.copy(turn.current.worldToLocal(hit)).normalize();
    }
    const wantedGlow = touching ? 1 : 0;
    uPointerGlow.value = approach(
      uPointerGlow.value,
      wantedGlow,
      prefersReducedMotion ? SNAP : POINTER_LAMBDA,
      dt,
    );

    // keep the demand loop alive until everything has arrived
    if (
      calm !== 0 ||
      sunMoving ||
      tinting ||
      turn.current.rotation.y !== wantedYaw ||
      tilt.current.rotation.x !== wantedPitch ||
      uEnergy.value !== wantedEnergy ||
      uPointerGlow.value !== wantedGlow
    ) {
      state.invalidate();
    }
  });

  return (
    <group ref={tilt}>
      <group ref={turn}>
        <Earth day={textures.day} night={textures.night} water={textures.water} />
        <Clouds texture={textures.clouds} ambient={ambient} />
        <DataArcs />
      </group>
      <Atmosphere />
    </group>
  );
}
