import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container">{children}</div>
    </section>
  );
}

/* "01 FEATURED WORK" left, "~/projects/featured" right. The number is the sequence down the page. */
export function SectionHead({ num, title, path, children }: { num: string; title: string; path: string; children?: ReactNode }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="sec-head">
        <h2 className="text-[0.8rem] font-medium tracking-[0.08em]">
          <span className="num" aria-hidden="true">{num}</span>
          {title}
        </h2>
        <span className="path" aria-hidden="true">{path}</span>
      </div>
      {children}
    </div>
  );
}
