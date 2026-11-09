import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

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

/* Section heading: two short sentences, the second in the accent. No kicker. */
export function Heading({ children, sub, className }: { children: ReactNode; sub?: string; className?: string }) {
  return (
    <div className={cn("mb-10 md:mb-14 max-w-[40ch]", className)}>
      <h2 className="text-[clamp(2rem,4.5vw,3rem)]">{children}</h2>
      {sub && <p className="mt-4 text-ink-soft text-lg">{sub}</p>}
    </div>
  );
}
