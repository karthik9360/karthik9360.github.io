"use client";

import type { PanelProps } from "@/components/overlay/sections/types";
import { SectionTitle } from "@/components/overlay/sections/SectionTitle";
import { projects } from "@/data/profile";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export function ProjectsSection({ headingId }: PanelProps) {
  const selectedProjectId = usePortfolioStore(
    (state) => state.selectedProjectId,
  );
  const selectProject = usePortfolioStore((state) => state.selectProject);
  const setHoveredProject = usePortfolioStore(
    (state) => state.setHoveredProject,
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle id={headingId}>Projects</SectionTitle>

      <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
        {projects.map((project) => {
          const isOpen = selectedProjectId === project.id;
          const detailsId = `project-${project.id}`;

          return (
            // Hover and focus tell the scene which project the visitor is on.
            <li
              key={project.id}
              className="group/project py-5"
              onPointerEnter={() => setHoveredProject(project.id)}
              onPointerLeave={() => setHoveredProject(null)}
              onFocus={() => setHoveredProject(project.id)}
              onBlur={() => setHoveredProject(null)}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={detailsId}
                  onClick={() => selectProject(isOpen ? null : project.id)}
                  className="flex w-full items-baseline justify-between gap-4 text-left text-lg font-medium transition-colors group-hover/project:text-accent"
                >
                  {project.title}
                  <span aria-hidden="true" className="font-light text-mist">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <p className="mt-2 leading-relaxed text-mist">{project.summary}</p>

              <div
                id={detailsId}
                inert={!isOpen}
                data-open={isOpen}
                className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-out data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100 motion-reduce:transition-none"
              >
                <div className="overflow-hidden">
                  <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-mist marker:text-accent">
                    {project.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  {project.tech.length > 0 && (
                    <p className="mt-4 text-sm text-mist">
                      Built with {project.tech.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
