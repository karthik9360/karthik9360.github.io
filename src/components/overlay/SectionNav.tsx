"use client";

import { SECTION_LIST } from "@/config/sections";
import { usePortfolioStore } from "@/store/usePortfolioStore";

/** Tab bar along the bottom on phones, inline in the header from `lg` up. */
export function SectionNav() {
  const activeSection = usePortfolioStore((state) => state.activeSection);
  const goTo = usePortfolioStore((state) => state.goTo);

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 pb-[env(safe-area-inset-bottom)] lg:static lg:border-0 lg:bg-transparent lg:pb-0"
    >
      <ul className="flex lg:gap-1">
        {SECTION_LIST.map(({ id, label }) => (
          <li key={id} className="flex-1 lg:flex-none">
            <button
              type="button"
              onClick={() => goTo(id)}
              aria-current={id === activeSection ? "true" : undefined}
              className="group relative flex h-14 w-full items-center justify-center text-[0.8125rem] font-medium text-mist transition-colors after:absolute after:inset-x-4 after:top-0 after:h-0.5 after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 hover:text-ice aria-[current=true]:text-ice aria-[current=true]:after:scale-x-100 lg:h-9 lg:w-auto lg:px-4 lg:pl-6 lg:after:hidden"
            >
              {/* indicator lamp, desktop only */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-3 hidden size-1.5 -translate-y-1/2 scale-0 rounded-full bg-accent transition-transform duration-500 group-aria-[current=true]:scale-100 lg:block"
              />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
