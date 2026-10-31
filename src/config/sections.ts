export const SECTION_IDS = [
  "home",
  "projects",
  "about",
  "skills",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type Vec3 = [x: number, y: number, z: number];

export interface SectionConfig {
  id: SectionId;
  label: string;
  /** Indicator colour. Tints the DOM accents and the data arcs on the globe. */
  accent: string;
  /** Where the camera sits and looks. `roll` tilts the horizon, in radians. */
  camera: { position: Vec3; target: Vec3; roll: number };
  /** The point on Earth turned toward the camera, in degrees. */
  facing: { lat: number; lon: number };
  /** Direction of the sun. Keeping it behind the planet leaves the middle dark for text. */
  sun: Vec3;
}

// Plain data, shared by the DOM layer and the 3D layer. Keep three.js imports out of
// this file so the DOM bundle never pulls them in.
//
// The globe is the page's background. Home shows the whole planet behind the hero; the
// panelled sections drop down to orbit, so the horizon curves behind the content.
export const SECTIONS: Record<SectionId, SectionConfig> = {
  home: {
    id: "home",
    label: "Home",
    accent: "#9bb4ff",
    camera: { position: [0, 0.35, 6.5], target: [0, 0.35, 0], roll: 0 },
    facing: { lat: 14, lon: 80 },
    sun: [-0.5, 0.45, -0.74],
  },
  projects: {
    id: "projects",
    label: "Projects",
    accent: "#f0c987",
    camera: { position: [0, 0, 4.4], target: [0, 1.5, 0], roll: 0 },
    facing: { lat: 20, lon: 105 },
    sun: [0.05, 0.6, -0.8],
  },
  about: {
    id: "about",
    label: "About",
    accent: "#86d3c4",
    camera: { position: [0, 0, 4.7], target: [0.5, 1.45, 0], roll: 0.28 },
    facing: { lat: 38, lon: 40 },
    sun: [0.45, 0.55, -0.7],
  },
  skills: {
    id: "skills",
    label: "Skills",
    accent: "#b5a2f2",
    camera: { position: [0, 0, 5.4], target: [0, 0, 0], roll: -0.2 },
    facing: { lat: 30, lon: 135 },
    sun: [0.62, -0.25, -0.74],
  },
  contact: {
    id: "contact",
    label: "Contact",
    accent: "#f2a6b6",
    camera: { position: [0, 0, 4.3], target: [0, 0.9, 0], roll: 0 },
    facing: { lat: 6, lon: 80 },
    sun: [-0.42, 0.55, -0.72],
  },
};

export const SECTION_LIST: SectionConfig[] = SECTION_IDS.map(
  (id) => SECTIONS[id],
);
