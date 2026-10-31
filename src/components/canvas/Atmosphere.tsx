"use client";

import { useMemo } from "react";
import { AdditiveBlending, BackSide } from "three";
import { worldUniforms } from "@/components/canvas/worldUniforms";
import { EARTH_RADIUS } from "@/lib/geo";

const SHELL_SCALE = 1.06;

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);

    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPosition = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uSun;
  uniform float uLimb;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 view = normalize(cameraPosition - vWorldPosition);

    // We see the inside of this shell. Its visible edge reads 0, the planet's limb reads 1.
    float height = clamp(-dot(normal, view) / uLimb, 0.0, 1.0);
    float glow = pow(height, 2.8);

    float lit = smoothstep(-0.4, 0.5, dot(normal, uSun));
    vec3 color = mix(vec3(0.03, 0.08, 0.26), vec3(0.16, 0.4, 1.0), lit) * (0.2 + lit * 0.62);

    // the sun, about to rise behind the planet, burns gold along the nearest stretch of limb
    float sunrise = pow(max(dot(-view, uSun), 0.0), 9.0);
    color += vec3(1.0, 0.55, 0.22) * sunrise * 0.8;

    gl_FragColor = vec4(color, glow);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** The glow around the planet: a slightly larger shell, drawn from the inside and added on. */
export function Atmosphere() {
  const uniforms = useMemo(
    () => ({
      uSun: worldUniforms.uSun,
      // cosine of the angle where a sight line grazing the planet meets the shell
      uLimb: { value: Math.sqrt(1 - 1 / SHELL_SCALE ** 2) },
    }),
    [],
  );

  return (
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS * SHELL_SCALE, 96, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={BackSide}
        blending={AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
