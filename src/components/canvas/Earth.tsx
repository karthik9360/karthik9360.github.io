"use client";

import { useMemo } from "react";
import type { Texture } from "three";
import { worldUniforms } from "@/components/canvas/worldUniforms";
import { CHENNAI, EARTH_RADIUS, surfacePoint } from "@/lib/geo";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vSurface;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);

    vUv = uv;
    vSurface = normalize(position);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPosition = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uWater;
  uniform vec3 uSun;
  uniform vec3 uAccent;
  uniform vec3 uCity;
  uniform vec3 uPointer;
  uniform float uPointerGlow;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vSurface;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 view = normalize(cameraPosition - vWorldPosition);
    float sunAngle = dot(normal, uSun);
    float daylight = smoothstep(-0.16, 0.3, sunAngle);

    // the lit surface, with sunlight glinting off the oceans
    vec3 day = texture2D(uDay, vUv).rgb;
    float ocean = texture2D(uWater, vUv).r;
    float glint = pow(max(dot(normal, normalize(uSun + view)), 0.0), 90.0);
    vec3 color = day * daylight;
    color += vec3(1.0, 0.86, 0.68) * glint * ocean * daylight * 1.1;

    // city lights, warmed up and only where the sun has gone down
    vec3 night = texture2D(uNight, vUv).rgb;
    color += pow(night, vec3(1.35)) * vec3(1.0, 0.8, 0.52) * 2.6 * (1.0 - daylight);

    // the warm band along the line between day and night
    float dusk = smoothstep(-0.26, 0.0, sunAngle) * (1.0 - smoothstep(0.0, 0.3, sunAngle));
    color += vec3(1.0, 0.4, 0.16) * dusk * 0.16;

    // air thickens toward the edge of the disc
    float rim = pow(1.0 - max(dot(normal, view), 0.0), 3.4);
    vec3 air = mix(vec3(0.04, 0.09, 0.26), vec3(0.34, 0.6, 1.0), smoothstep(-0.3, 0.5, sunAngle));
    color += air * rim * (0.22 + 0.5 * smoothstep(-0.35, 0.4, sunAngle));

    // a radar ping from Chennai
    float fromCity = distance(vSurface, uCity);
    float wave = fract(uTime * 0.22);
    float ping = smoothstep(0.016, 0.0, abs(fromCity - wave * 0.46)) * (1.0 - wave);
    float beacon = smoothstep(0.011, 0.003, fromCity);
    color += uAccent * (ping * 1.3 + beacon * 2.0);

    // the pointer's ray lights a patch of latitude and longitude lines on the surface
    float fromPointer = distance(vSurface, uPointer);
    float spot = smoothstep(0.44, 0.0, fromPointer) * uPointerGlow;
    vec2 cell = vUv * vec2(72.0, 36.0);
    vec2 lines = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
    float graticule = 1.0 - min(min(lines.x, lines.y), 1.0);
    color += uAccent * (graticule * spot * 0.6 + spot * spot * 0.05);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

interface EarthProps {
  day: Texture;
  night: Texture;
  water: Texture;
}

/** The planet's surface: day and night sides, ocean glint, city lights and the ping. */
export function Earth({ day, night, water }: EarthProps) {
  const uniforms = useMemo(
    () => ({
      ...worldUniforms,
      uDay: { value: day },
      uNight: { value: night },
      uWater: { value: water },
      uCity: { value: surfacePoint(CHENNAI.lat, CHENNAI.lon) },
    }),
    [day, night, water],
  );

  return (
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS, 128, 96]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
