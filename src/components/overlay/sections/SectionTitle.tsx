import type { ReactNode } from "react";

interface SectionTitleProps {
  id: string;
  children: ReactNode;
}

export function SectionTitle({ id, children }: SectionTitleProps) {
  return (
    <h2
      id={id}
      tabIndex={-1}
      className="font-expanded text-[clamp(2rem,3.6vw,3.25rem)] leading-none font-light tracking-tight outline-none"
    >
      {children}
    </h2>
  );
}
