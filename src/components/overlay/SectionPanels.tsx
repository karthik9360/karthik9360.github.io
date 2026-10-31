"use client";

import { useEffect, useRef, type ComponentType } from "react";
import { AboutSection } from "@/components/overlay/sections/AboutSection";
import { ContactSection } from "@/components/overlay/sections/ContactSection";
import { HomeSection } from "@/components/overlay/sections/HomeSection";
import { ProjectsSection } from "@/components/overlay/sections/ProjectsSection";
import { SkillsSection } from "@/components/overlay/sections/SkillsSection";
import type { PanelProps } from "@/components/overlay/sections/types";
import { SECTION_LIST, type SectionId } from "@/config/sections";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const PANELS: Record<SectionId, ComponentType<PanelProps>> = {
  home: HomeSection,
  about: AboutSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  contact: ContactSection,
};

/**
 * Every panel stays mounted in the same grid cell and cross-fades. Hidden panels are
 * `inert`, so they leave the tab order and the accessibility tree while their text
 * stays in the HTML for search engines.
 *
 * Home sits straight on the scene. The denser sections sit on frosted glass, which keeps
 * them readable while the scene stays visible through and around them.
 */
export function SectionPanels() {
  const activeSection = usePortfolioStore((state) => state.activeSection);
  const previousSection = useRef(activeSection);

  // A panel that goes inert takes keyboard focus with it. If focus was inside it (or was
  // lost), hand it to the new panel's heading. Focus the visitor put on the nav stays there.
  useEffect(() => {
    if (previousSection.current === activeSection) return;

    const leaving = document.getElementById(`panel-${previousSection.current}`);
    previousSection.current = activeSection;

    const focused = document.activeElement;
    const focusWasLost =
      !focused || focused === document.body || leaving?.contains(focused);
    if (!focusWasLost) return;

    document
      .getElementById(`heading-${activeSection}`)
      ?.focus({ preventScroll: true });
  }, [activeSection]);

  return (
    <div className="grid w-full max-w-[60rem] justify-items-center">
      {SECTION_LIST.map(({ id }) => {
        const Panel = PANELS[id];
        const isActive = id === activeSection;

        return (
          <section
            key={id}
            id={`panel-${id}`}
            aria-labelledby={`heading-${id}`}
            inert={!isActive}
            data-active={isActive}
            className={`panel-scroll pointer-events-none col-start-1 row-start-1 max-h-(--panel-max) w-full scale-[0.985] self-center overflow-y-auto overscroll-contain opacity-0 transition-[opacity,scale] duration-700 ease-out data-[active=true]:pointer-events-auto data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:delay-150 motion-reduce:transition-none ${id === "home" ? "" : "glass-panel max-w-[40rem]"}`}
          >
            <Panel headingId={`heading-${id}`} />
          </section>
        );
      })}
    </div>
  );
}
