import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Section = forwardRef<HTMLElement, { id?: string; className?: string; children: ReactNode }>(function Section(
  { id, className, children },
  ref
) {
  return (
    <section ref={ref} id={id} className={cn("py-20 md:py-28", className)}>
      <div className="container">{children}</div>
    </section>
  );
});

export function SectionTitle({ title, note, aside, className }: { title: string; note?: string; aside?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-10 md:mb-14 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-3xl md:text-[2.6rem]">{title}</h2>
        {note && <p className="text-text-soft mt-2 max-w-[52ch]">{note}</p>}
      </div>
      {aside}
    </div>
  );
}
