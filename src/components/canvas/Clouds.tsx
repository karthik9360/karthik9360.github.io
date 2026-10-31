"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, Texture } from "three";
import { worldUniforms } from "@/components/canvas/worldUniforms";
import { frameStep } from "@/lib/damp";
import { EARTH_RADIUS } from "@/lib/geo";

const DRIFT_SPEED = 0.009;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;

  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uClouds;
  uniform vec3 uSun;

  varying vec2 vUv;
  varying vec3 vWorldNormal;

  void main() {
    float density = texture2D(uClouds, vUv).r;
    float lit = smoothstep(-0.14, 0.34, dot(normalize(vWorldNormal), uSun));

    // bright in sunlight; at night they go dark and pass in front of the city lights
    vec3 color = mix(vec3(0.012, 0.016, 0.032), vec3(1.0), lit);
    gl_FragColor = vec4(color, density * mix(0.5, 0.92, lit));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

interface CloudsProps {
  texture: Texture;
  /** 1 while the scene is engaged, easing to 0 at rest. */
  ambient: RefObject<number>;
}

/** A thin layer above the surface, drifting at its own pace. */
export function Clouds({ texture, ambient }: CloudsProps) {
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo(
    () => ({ uSun: worldUniforms.uSun, uClouds: { value: texture } }),
    [texture],
  );

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += frameStep(delta) * DRIFT_SPEED * ambient.current;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[EARTH_RADIUS * 1.007, 96, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
