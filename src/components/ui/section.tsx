import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Ribbon } from "./ornaments";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section({ id, className, children }, ref) {
  return (
    <section ref={ref} id={id} className={cn("py-20 md:py-28", className)}>
      <div className="container">{children}</div>
    </section>
  );
});

/* Section title drawn as a map label: ribbon + handwritten subtitle. */
export function Banner({ title, note, className }: { title: string; note?: string; className?: string }) {
  return (
    <div className={cn("mb-12 md:mb-16 flex flex-col items-start gap-3", className)}>
      <h2 className="text-3xl md:text-4xl">
        <Ribbon className="text-[0.85em] md:text-[0.8em]">{title}</Ribbon>
      </h2>
      {note && <p className="margin-note ml-4">{note}</p>}
    </div>
  );
}
