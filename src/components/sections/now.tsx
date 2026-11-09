import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resume, experiences } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { LocalTime } from "@/components/ui/local-time";
import { Chips } from "@/components/ui/badge";

const current = experiences[0];

export function Now() {
  return (
    <Section id="now" className="pt-0">
      <div className="grid md:grid-cols-6 gap-4">
        <article className="card p-6 md:col-span-3 flex flex-col">
          <span className="label">About</span>
          <p className="mt-3 text-text text-lg leading-snug">{resume.summary.split(". ")[0]}.</p>
          <p className="mt-3 text-text-soft text-[0.95rem]">{resume.summary.split(". ").slice(1).join(". ")}</p>
        </article>

        <article className="card p-6 md:col-span-3 flex flex-col">
          <span className="label">Now</span>
          <h3 className="mt-3 font-display text-2xl">{current.company}</h3>
          <p className="text-text-soft mt-1">{current.role} · {current.period}</p>
          <p className="text-text-soft mt-3 text-[0.95rem]">{current.description}</p>
          <Chips items={current.technologies} className="mt-auto pt-5" />
        </article>

        <article className="card p-6 md:col-span-2">
          <span className="label">Based in</span>
          <p className="mt-3 font-display text-2xl">Gurugram, India</p>
          <p className="text-text-soft mt-1">
            <LocalTime /> · overlaps US and UK mornings
          </p>
        </article>

        <article className="card p-6 md:col-span-2">
          <span className="label">How I work</span>
          <ul className="mt-3 space-y-2 text-[0.95rem] text-text-soft">
            <li>Event-driven before shared tables.</li>
            <li>Tests against mocks, behind CI gates.</li>
            <li>Cost is a feature: autoscale on real signals.</li>
          </ul>
        </article>

        <article className="card p-6 md:col-span-2 flex flex-col">
          <span className="label">Reach out</span>
          <p className="mt-3 text-text-soft text-[0.95rem]">Hiring for a senior backend role, or want a second opinion on a system?</p>
          <Link href="#contact" className="btn btn-line mt-auto self-start !min-h-[40px] !py-1.5 mt-5">
            Say hello <ArrowUpRight className="w-4 h-4" />
          </Link>
        </article>
      </div>
    </Section>
  );
}
