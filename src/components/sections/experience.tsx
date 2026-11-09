"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { experiences, type Experience as Role } from "@/data/profile";
import { Section, SectionHead } from "@/components/ui/section";
import { TermDialog } from "@/components/ui/dialog";
import { shortHash } from "@/lib/utils";

export function Experience() {
  const [selected, setSelected] = useState<Role | null>(null);

  const openRole = (exp: Role) => {
    posthog.capture("experience_modal_opened", { company: exp.company, role: exp.role, period: exp.period });
    setSelected(exp);
  };

  return (
    <Section id="experience">
      <SectionHead num="02" title="Experience" path="~/experience">
        <p className="mt-6 text-fg-dim text-[0.9rem]">
          <span className="prompt">$</span> git log --oneline <span className="text-fg-faint">{"// "}newest first</span>
        </p>
      </SectionHead>

      <ol>
        {experiences.map((exp) => (
          <li key={exp.id}>
            <button onClick={() => openRole(exp)} className="row grid-cols-[auto_1fr_auto] md:grid-cols-[auto_auto_1fr_auto]" aria-haspopup="dialog">
              <span className="text-accent text-[0.9rem]" translate="no">{shortHash(exp.company)}</span>
              <span className="hidden md:block text-fg-faint text-[0.85rem] whitespace-nowrap">({exp.period})</span>
              <span className="min-w-0 text-fg">
                <span className="truncate block">
                  {exp.role} <span className="text-fg-dim">@ {exp.company}</span>
                </span>
                <span className="block md:hidden text-fg-faint text-[0.8rem]">{exp.period}</span>
              </span>
              <span className="arrow text-fg-faint" aria-hidden="true">↗</span>
            </button>
          </li>
        ))}
      </ol>

      <TermDialog open={!!selected} onClose={() => setSelected(null)} title={selected ? `git show ${shortHash(selected.company)}` : "role"}>
        {selected && (
          <article>
            <p className="text-xs text-fg-faint tracking-[0.08em] uppercase">{selected.period}{selected.location ? ` · ${selected.location}` : ""}</p>
            <h2 className="text-2xl font-medium mt-1">{selected.company}</h2>
            <p className="text-accent">{selected.role}</p>
            <p className="mt-4 text-fg-dim">{selected.description}</p>
            <h3 className="text-xs uppercase tracking-[0.08em] text-fg-faint mt-8 mb-3"><span className="prompt">#</span> shipped</h3>
            <ul className="space-y-3 text-fg-dim">
              {selected.achievements.map((a) => (
                <li key={a} className="pl-5 relative before:content-['-'] before:absolute before:left-0 before:text-accent">{a}</li>
              ))}
            </ul>
            <h3 className="text-xs uppercase tracking-[0.08em] text-fg-faint mt-8 mb-2"><span className="prompt">#</span> stack</h3>
            <p className="text-fg-dim">{selected.technologies.join(" · ")}</p>
          </article>
        )}
      </TermDialog>
    </Section>
  );
}
