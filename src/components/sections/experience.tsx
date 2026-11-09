"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import posthog from "posthog-js";
import { experiences, education, type Experience as Role } from "@/data/profile";
import { Section, SectionTitle } from "@/components/ui/section";
import { Chips } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";

export function Experience() {
  const [selected, setSelected] = useState<Role | null>(null);

  const open = (exp: Role) => {
    posthog.capture("experience_modal_opened", { company: exp.company, role: exp.role, period: exp.period });
    setSelected(exp);
  };

  return (
    <Section id="experience">
      <SectionTitle
        title="Experience"
        note="Four companies, one through-line: the service that has to stay up."
        aside={
          <p className="text-sm text-text-soft">
            {education.degree.split(",")[0]} · {education.university} · {education.period}
          </p>
        }
      />

      <ul className="border-t border-line/10">
        {experiences.map((exp) => (
          <li key={exp.id} className="border-b border-line/10">
            <button
              onClick={() => open(exp)}
              className="group w-full text-left grid md:grid-cols-12 gap-2 md:gap-6 py-6 md:py-7 items-baseline rounded-lg -mx-3 px-3 hover:bg-surface transition-colors"
              aria-haspopup="dialog"
            >
              <span className="md:col-span-3 font-mono text-xs text-text-faint tabular-nums">{exp.period}</span>
              <span className="md:col-span-5">
                <span className="block font-display text-2xl leading-tight">{exp.company}</span>
                <span className="block text-text-soft mt-0.5">{exp.role}</span>
              </span>
              <span className="md:col-span-3 text-[0.95rem] text-text-soft">{exp.description}</span>
              <ArrowUpRight className="hidden md:block md:col-span-1 justify-self-end w-5 h-5 text-text-faint group-hover:text-accent transition-colors" />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.company}: ${selected.role}` : "Role"}>
        {selected && (
          <article>
            <span className="label">{selected.period}{selected.location ? ` · ${selected.location}` : ""}</span>
            <h2 className="font-display text-3xl mt-2 pr-10">{selected.company}</h2>
            <p className="text-accent mt-1">{selected.role}</p>
            <p className="mt-4 text-text-soft">{selected.description}</p>
            <h3 className="label mt-8 mb-3">What shipped</h3>
            <ul className="space-y-3 text-text-soft">
              {selected.achievements.map((a) => (
                <li key={a} className="pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-2 before:rounded-full before:bg-accent/70">
                  {a}
                </li>
              ))}
            </ul>
            <h3 className="label mt-8 mb-3">Stack</h3>
            <Chips items={selected.technologies} />
          </article>
        )}
      </Dialog>
    </Section>
  );
}
