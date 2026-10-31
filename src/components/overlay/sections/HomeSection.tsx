"use client";

import type { PanelProps } from "@/components/overlay/sections/types";
import { profile } from "@/data/profile";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export function HomeSection({ headingId }: PanelProps) {
  const goTo = usePortfolioStore((state) => state.goTo);

  return (
    <div className="hero-text flex flex-col items-center gap-3 text-center lg:gap-6">
      <div className="flex flex-col gap-2 lg:gap-4">
        <p className="lg:text-lg">
          {profile.name}, {profile.role}
        </p>
        <h1
          id={headingId}
          tabIndex={-1}
          className="font-expanded text-[clamp(2.125rem,5.6vw,5.5rem)] leading-[1.02] font-light tracking-tight outline-none"
        >
          {profile.headline}
        </h1>
      </div>

      <div className="flex max-w-[36rem] flex-col gap-1.5 lg:gap-2">
        <p className="leading-relaxed text-ice/85 lg:text-lg">{profile.intro}</p>
        <p className="text-sm text-ice/70">{profile.coreStack.join(", ")}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={() => goTo("projects")}
          className="rounded-full bg-ice px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent"
        >
          See projects
        </button>
        <a
          href={profile.resume}
          download
          className="text-sm font-medium underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Download resume
        </a>
      </div>

      <dl className="grid w-full max-w-[38rem] grid-cols-3 gap-3 border-t border-white/15 pt-3 lg:gap-5 lg:pt-5">
        {profile.proof.map(({ value, label }) => (
          <div key={value} className="flex flex-col-reverse justify-end gap-1">
            <dt className="text-xs leading-snug text-ice/70 lg:text-sm">
              {label}
            </dt>
            <dd className="font-expanded text-[clamp(1.375rem,2.6vw,2.25rem)] leading-none font-light">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
