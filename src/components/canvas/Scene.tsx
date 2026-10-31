"use client";

import { CameraRig } from "@/components/canvas/CameraRig";
import { DemandInvalidator } from "@/components/canvas/DemandInvalidator";
import { StarField } from "@/components/canvas/StarField";
import { World } from "@/components/canvas/World";

export function Scene() {
  return (
    <>
      <DemandInvalidator />
      <CameraRig />
      <StarField />
      <World />
    </>
  );
}
