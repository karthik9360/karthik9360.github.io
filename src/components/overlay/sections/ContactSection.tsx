import type { PanelProps } from "@/components/overlay/sections/types";
import { SectionTitle } from "@/components/overlay/sections/SectionTitle";
import { profile } from "@/data/profile";

export function ContactSection({ headingId }: PanelProps) {
  const links = profile.links.filter((link) => link.href);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle id={headingId}>Hiring a full stack developer?</SectionTitle>

      <div className="flex flex-col gap-3">
        <p className="text-mist">Email is the quickest way to reach me.</p>
        <a
          href={`mailto:${profile.email}`}
          className="font-expanded text-[clamp(1.25rem,3.4vw,1.875rem)] font-light break-all underline decoration-white/25 underline-offset-8 transition-colors hover:decoration-accent"
        >
          {profile.email}
        </a>
      </div>

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <li>
          <a
            href={profile.resume}
            download
            className="inline-block rounded-full bg-ice px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent"
          >
            Download resume
          </a>
        </li>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <p className="text-sm text-mist">Based in {profile.location}</p>
    </div>
  );
}
