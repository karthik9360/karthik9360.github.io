"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Matrix4,
  type InstancedMesh,
  type MeshBasicMaterial,
} from "three";
import { useFrame } from "@react-three/fiber";
import { worldUniforms } from "@/components/canvas/worldUniforms";
import { createArcs, hubPositions } from "@/lib/geo";

const BEACON_SIZE = 0.011;

const vertexShader = /* glsl */ `
  attribute float aPhase;

  varying float vAlong;
  varying float vPhase;

  void main() {
    vAlong = uv.x;
    vPhase = aPhase;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uAccent;
  uniform float uTime;
  uniform float uEnergy;

  varying float vAlong;
  varying float vPhase;

  void main() {
    // a comet running out from Chennai: bright at the head, fading along its tail
    float head = fract(uTime * 0.16 + vPhase);
    float tail = smoothstep(0.36, 0.0, fract(head - vAlong));
    float comet = tail * tail * tail;

    // and a faint line for the whole route, fading out where it meets the ground
    float ends = smoothstep(0.0, 0.05, vAlong) * smoothstep(1.0, 0.95, vAlong);
    float strength = (0.07 + comet * (0.75 + uEnergy * 1.1)) * ends;

    gl_FragColor = vec4(mix(uAccent, vec3(1.0), comet * 0.45), strength);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** Routes of light from Chennai to the rest of the world, in one draw call. */
export function DataArcs() {
  const beacons = useRef<InstancedMesh>(null);
  const beaconSkin = useRef<MeshBasicMaterial>(null);
  const geometry = useMemo(() => createArcs(), []);
  const hubs = useMemo(() => hubPositions(), []);
  const uniforms = useMemo(
    () => ({
      uAccent: worldUniforms.uAccent,
      uTime: worldUniforms.uTime,
      uEnergy: worldUniforms.uEnergy,
    }),
    [],
  );

  // Fiber disposes what it builds from JSX, and this geometry comes in through a prop.
  useEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    if (!beacons.current) return;

    const matrix = new Matrix4();
    hubs.forEach((hub, index) => {
      matrix.makeScale(BEACON_SIZE, BEACON_SIZE, BEACON_SIZE).setPosition(hub);
      beacons.current?.setMatrixAt(index, matrix);
    });
    beacons.current.instanceMatrix.needsUpdate = true;
  }, [hubs]);

  useFrame(() => {
    beaconSkin.current?.color.copy(worldUniforms.uAccent.value);
  });

  return (
    <>
      <mesh geometry={geometry}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>

      <instancedMesh
        ref={beacons}
        args={[undefined, undefined, hubs.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 10, 8]} />
        <meshBasicMaterial ref={beaconSkin} toneMapped={false} />
      </instancedMesh>
    </>
  );
}
