import {
  BufferAttribute,
  CatmullRomCurve3,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export const EARTH_RADIUS = 2;

export const CHENNAI = { lat: 13.08, lon: 80.27 };

// Purely scenery: the arcs show data moving, not places Karthik has worked.
const HUBS = [
  { lat: 51.5, lon: -0.1 }, // London
  { lat: 50.1, lon: 8.7 }, // Frankfurt
  { lat: 25.2, lon: 55.3 }, // Dubai
  { lat: -26.2, lon: 28 }, // Johannesburg
  { lat: 1.35, lon: 103.8 }, // Singapore
  { lat: 35.7, lon: 139.7 }, // Tokyo
  { lat: -33.9, lon: 151.2 }, // Sydney
  { lat: 37.8, lon: -122.4 }, // San Francisco
  { lat: 40.7, lon: -74 }, // New York
  { lat: -23.5, lon: -46.6 }, // Sao Paulo
];

const ARC_SAMPLES = 48;
const ARC_SEGMENTS = 96;
const ARC_THICKNESS = 0.0034;
const HALF_PI = Math.PI / 2;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Unit vector for a coordinate, on a SphereGeometry wrapped in an equirectangular map. */
export function surfacePoint(lat: number, lon: number, out = new Vector3()) {
  const latitude = toRadians(lat);
  const longitude = toRadians(lon);
  return out.set(
    Math.cos(latitude) * Math.cos(longitude),
    Math.sin(latitude),
    -Math.cos(latitude) * Math.sin(longitude),
  );
}

/** Y rotation that turns a longitude toward the camera. */
export const facingYaw = (lon: number) => -HALF_PI - toRadians(lon);

/** X rotation that turns a latitude toward the camera. */
export const facingPitch = (lat: number) => toRadians(lat);

/** Points on the great circle from `start` to `end`, lifted into an arc above the surface. */
function arcPoints(start: Vector3, end: Vector3) {
  const angle = start.angleTo(end);
  const lift = 0.08 + (angle / Math.PI) * 0.42;

  return Array.from({ length: ARC_SAMPLES + 1 }, (_, i) => {
    const t = i / ARC_SAMPLES;
    const fromStart = Math.sin((1 - t) * angle) / Math.sin(angle);
    const fromEnd = Math.sin(t * angle) / Math.sin(angle);
    return new Vector3()
      .addScaledVector(start, fromStart)
      .addScaledVector(end, fromEnd)
      .normalize()
      .multiplyScalar(EARTH_RADIUS * 1.002 + lift * Math.sin(Math.PI * t));
  });
}

/** Where each arc lands, for placing its beacon. */
export function hubPositions() {
  return HUBS.map(({ lat, lon }) =>
    surfacePoint(lat, lon).multiplyScalar(EARTH_RADIUS * 1.003),
  );
}

/**
 * One tube per hub, merged into a single draw call. `uv.x` runs along each tube, and
 * `aPhase` staggers when its pulse fires.
 *
 * The caller owns the result and must dispose it: it reaches the mesh through a prop, and
 * fiber only disposes what it builds from JSX.
 */
export function createArcs(): BufferGeometry {
  const start = surfacePoint(CHENNAI.lat, CHENNAI.lon);

  const tubes = HUBS.map(({ lat, lon }, index) => {
    const curve = new CatmullRomCurve3(
      arcPoints(start, surfacePoint(lat, lon)),
    );
    const tube = new TubeGeometry(curve, ARC_SEGMENTS, ARC_THICKNESS, 6);
    const phase = new Float32Array(tube.getAttribute("position").count);
    tube.setAttribute(
      "aPhase",
      new BufferAttribute(phase.fill(index / HUBS.length), 1),
    );
    return tube;
  });

  const arcs = mergeGeometries(tubes);
  tubes.forEach((tube) => tube.dispose());
  if (!arcs) throw new Error("Could not merge the arc geometry");

  return arcs;
}
