import type { PanelProps } from "@/components/overlay/sections/types";
import { SectionTitle } from "@/components/overlay/sections/SectionTitle";
import { skillGroups } from "@/data/profile";

export function SkillsSection({ headingId }: PanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle id={headingId}>Skills</SectionTitle>

      <dl className="flex flex-col divide-y divide-white/10 border-y border-white/10">
        {skillGroups.map((group) => (
          <div
            key={group.label}
            className="grid gap-1 py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-4"
          >
            <dt className="text-sm text-mist">{group.label}</dt>
            <dd className="leading-relaxed">{group.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
