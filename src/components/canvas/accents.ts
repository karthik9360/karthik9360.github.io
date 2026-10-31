import { Color } from "three";
import { SECTION_IDS, SECTIONS, type SectionId } from "@/config/sections";

/** Section accents as three.js colours, ready to ease toward. */
export const ACCENTS = Object.fromEntries(
  SECTION_IDS.map((id) => [id, new Color(SECTIONS[id].accent)]),
) as Record<SectionId, Color>;
