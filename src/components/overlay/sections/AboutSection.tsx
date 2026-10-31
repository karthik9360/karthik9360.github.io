import type { PanelProps } from "@/components/overlay/sections/types";
import { SectionTitle } from "@/components/overlay/sections/SectionTitle";
import { profile } from "@/data/profile";

export function AboutSection({ headingId }: PanelProps) {
  const { experience, education } = profile;

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle id={headingId}>Why work with me</SectionTitle>

      <ul className="flex flex-col gap-4">
        {profile.reasons.map(({ title, body }) => (
          <li key={title} className="flex flex-col gap-1">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="leading-relaxed text-mist">{body}</p>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
        <div>
          <h3 className="text-lg font-medium">
            {experience.role}, {experience.company}
          </h3>
          <p className="text-sm text-mist">{experience.period}</p>
        </div>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-mist marker:text-accent">
          {experience.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <p className="text-sm text-mist">
          {education.degree}, {education.school}, {education.period}
        </p>
      </div>
    </div>
  );
}
