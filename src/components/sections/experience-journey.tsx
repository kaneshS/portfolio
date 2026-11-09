"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { experiences, type Experience } from "@/data/profile";
import { Section, Banner } from "@/components/ui/section";
import { Footprint, Ribbon } from "@/components/ui/ornaments";
import { InkList } from "@/components/ui/badge";
import { NoteDialog } from "@/components/ui/dialog";
import { useInView } from "@/lib/use-in-view";

/*
  The Corridors: a single corridor runs down the page; each role is a door off
  it. Footprints walk the corridor as it enters view - the one authored moment.
*/
export function ExperienceJourney() {
  const [selected, setSelected] = useState<Experience | null>(null);
  const trail = useInView<HTMLOListElement>("0px 0px -10% 0px");
  const oldestFirst = [...experiences].reverse();

  const openRole = (exp: Experience) => {
    posthog.capture("experience_modal_opened", { company: exp.company, role: exp.role, period: exp.period });
    setSelected(exp);
  };

  return (
    <Section id="journey">
      <Banner title="The Corridors" note="every door opened, oldest first" />

      <ol ref={trail} className="relative max-w-4xl mx-auto">
        {/* the corridor */}
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px border-l border-dashed border-rule/70 md:-translate-x-px" aria-hidden="true" />

        {oldestFirst.map((exp, i) => {
          const left = i % 2 === 0;
          const stepsBefore = i * 6;
          return (
            <li key={exp.id} className="relative grid md:grid-cols-2 gap-x-16 pl-14 md:pl-0 pb-16 last:pb-0">
              {/* footprints along the corridor between doors */}
              <div className="absolute left-5 md:left-1/2 -translate-x-1/2 top-2 bottom-6 flex flex-col items-center justify-between" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, k) => (
                  <span key={k} className="footprint block w-4 h-5 text-ink" style={{ ["--i" as string]: stepsBefore + k, marginLeft: k % 2 ? 10 : -10 }}>
                    <Footprint left={k % 2 === 0} className="w-full h-full rotate-180" />
                  </span>
                ))}
              </div>

              <div className={left ? "md:col-start-1 md:text-right" : "md:col-start-2"}>
                <button
                  onClick={() => openRole(exp)}
                  className={`group text-left w-full map-frame on-paper lift p-5 md:p-6 ${left ? "md:text-right" : ""}`}
                  aria-haspopup="dialog"
                >
                  <p className="font-display text-xs text-ink-faint tracking-widest uppercase">{exp.period}</p>
                  <h3 className="text-2xl mt-1 text-ink">{exp.company}</h3>
                  <p className="font-hand text-xl text-wax mt-0.5">{exp.role}</p>
                  <p className="text-[0.95rem] text-ink-soft mt-3">{exp.description}</p>
                  <InkList items={exp.technologies.slice(0, 5)} className={`mt-4 ${left ? "md:text-right" : ""}`} />
                  <span className="ink-link inline-block mt-4 font-display text-sm text-ink group-hover:bg-[length:100%_1px]">Open the door →</span>
                </button>
              </div>
            </li>
          );
        })}

        <li className="relative pl-14 md:pl-0 pt-10 flex md:justify-center">
          <Ribbon className="text-lg">You are here · {new Date().getFullYear()}</Ribbon>
        </li>
      </ol>

      <NoteDialog open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.company}: ${selected.role}` : "Role"}>
        {selected && (
          <article>
            <p className="font-display text-xs text-ink-faint tracking-widest uppercase">{selected.period}{selected.location ? ` · ${selected.location}` : ""}</p>
            <h2 className="text-3xl mt-1">{selected.company}</h2>
            <p className="font-hand text-2xl text-wax">{selected.role}</p>
            <p className="mt-4 text-ink-soft">{selected.description}</p>
            <h3 className="font-display text-sm text-ink mt-8 mb-3 tracking-wide">What was built</h3>
            <ul className="space-y-3 text-ink-soft">
              {selected.achievements.map((a) => (
                <li key={a} className="pl-5 relative before:content-['✦'] before:absolute before:left-0 before:text-wax before:text-xs before:top-1.5">{a}</li>
              ))}
            </ul>
            <h3 className="font-display text-sm text-ink mt-8 mb-2 tracking-wide">Carried</h3>
            <InkList items={selected.technologies} />
          </article>
        )}
      </NoteDialog>
    </Section>
  );
}
