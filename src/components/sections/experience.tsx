"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import posthog from "posthog-js";
import { experiences, education, type Experience } from "@/data/profile";
import { Section, Heading } from "@/components/ui/section";
import { InlineList } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";

/* A ledger: company, role, dates, one line. Click for the full entry. */
export function ExperienceLedger() {
  const [selected, setSelected] = useState<Experience | null>(null);

  const openRole = (exp: Experience) => {
    posthog.capture("experience_modal_opened", { company: exp.company, role: exp.role, period: exp.period });
    setSelected(exp);
  };

  return (
    <Section id="experience">
      <Heading sub="Four companies, oldest at the bottom.">
        Where the work <span className="text-accent">happened.</span>
      </Heading>

      <ul className="border-b border-rule">
        {experiences.map((exp) => (
          <li key={exp.id}>
            <button onClick={() => openRole(exp)} className="row grid-cols-[1fr_auto] md:grid-cols-[10rem_1.2fr_1.4fr_auto] gap-x-6 gap-y-1 items-baseline" aria-haspopup="dialog">
              <span className="meta order-3 md:order-none col-span-2 md:col-span-1 mt-1 md:mt-0">{exp.period}</span>
              <span className="order-1 md:order-none">
                <span className="block font-medium text-ink">{exp.company}</span>
                <span className="block text-ink-soft text-[0.95rem]">{exp.role}</span>
              </span>
              <span className="hidden md:block text-ink-soft text-[0.95rem]">{exp.description}</span>
              <ArrowUpRight className="w-5 h-5 text-ink-soft justify-self-end order-2 md:order-none self-center" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-[0.95rem] text-ink-soft">
        <span className="text-ink font-medium">{education.degree}</span>, {education.university}, {education.location} · {education.period}
      </p>

      <Dialog open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.company}: ${selected.role}` : "Role"}>
        {selected && (
          <article>
            <p className="meta">
              {selected.period}
              {selected.location ? ` · ${selected.location}` : ""}
            </p>
            <h2 className="text-3xl mt-2 pr-10">{selected.company}</h2>
            <p className="text-accent font-medium mt-1">{selected.role}</p>
            <p className="mt-4 text-ink-soft">{selected.description}</p>
            <h3 className="text-base font-medium mt-8 mb-3">What was built</h3>
            <ul className="space-y-3 text-ink-soft">
              {selected.achievements.map((a) => (
                <li key={a} className="pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:w-2 before:h-px before:bg-accent">
                  {a}
                </li>
              ))}
            </ul>
            <h3 className="text-base font-medium mt-8 mb-2">Stack</h3>
            <InlineList items={selected.technologies} />
          </article>
        )}
      </Dialog>
    </Section>
  );
}
