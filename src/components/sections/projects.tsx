"use client";

import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import posthog from "posthog-js";
import { projects, type Project } from "@/data/profile";
import { Section, Banner } from "@/components/ui/section";
import { InkList } from "@/components/ui/badge";
import { Mermaid } from "@/components/ui/mermaid";
import { NoteDialog } from "@/components/ui/dialog";

const roomNames = ["Great Hall", "Astronomy Tower", "Potions Dungeon", "Room of Requirement"];

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  const open = (p: Project) => {
    posthog.capture("project_modal_opened", { project_id: p.id, project_title: p.title });
    setSelected(p);
  };

  return (
    <Section id="projects">
      <Banner title="The Chambers" note="rooms built for one problem each" />

      <div className="relative grid md:grid-cols-2 gap-6 md:gap-8">
        {/* passages between the rooms */}
        <div className="hidden md:block absolute inset-x-1/2 top-[20%] bottom-[20%] w-px border-l border-dashed border-rule/60" aria-hidden="true" />
        <div className="hidden md:block absolute inset-y-1/2 left-[12%] right-[12%] h-px border-t border-dashed border-rule/60" aria-hidden="true" />

        {projects.map((p, i) => (
          <button
            key={p.id}
            onClick={() => open(p)}
            className="relative text-left map-frame on-paper lift p-6 md:p-7 flex flex-col"
            aria-haspopup="dialog"
          >
            <span className="font-display text-xs text-ink-faint tracking-widest uppercase">{roomNames[i % roomNames.length]}</span>
            <h3 className="text-2xl mt-1 text-ink">{p.title}</h3>
            <p className="text-ink-soft mt-2 text-[0.95rem]">{p.description}</p>

            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {p.metrics.slice(0, 3).map((m) => (
                <div key={m.label}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="font-display text-xl text-ink tabular-nums leading-none">{m.value}</dd>
                  <dd className="text-xs text-ink-faint mt-1">{m.label}</dd>
                </div>
              ))}
            </dl>

            <InkList items={p.technologies.slice(0, 5)} className="mt-auto pt-5" />
            <span className="ink-link self-start mt-3 font-display text-sm text-ink">Enter the chamber →</span>
          </button>
        ))}
      </div>

      <NoteDialog open={!!selected} onClose={() => setSelected(null)} title={selected?.title ?? "Project"}>
        {selected && (
          <article>
            <h2 className="text-3xl">{selected.title}</h2>
            <p className="text-ink-soft mt-2">{selected.description}</p>

            <dl className="mt-6 grid grid-cols-3 gap-4 rule-dashed pt-5">
              {selected.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="font-display text-2xl text-ink tabular-nums">{m.value}</dd>
                  <dt className="text-xs text-ink-faint">{m.label}</dt>
                </div>
              ))}
            </dl>

            <h3 className="font-display text-sm mt-8 mb-2 tracking-wide">The problem</h3>
            <p className="text-ink-soft">{selected.problem}</p>

            <h3 className="font-display text-sm mt-8 mb-2 tracking-wide">The plan of the room</h3>
            <p className="text-ink-soft mb-4">{selected.architecture}</p>
            {selected.architectureDiagram && (
              <div className="map-frame p-3">
                <Mermaid chart={selected.architectureDiagram} />
              </div>
            )}

            <h3 className="font-display text-sm mt-8 mb-2 tracking-wide">Built with</h3>
            <InkList items={selected.technologies} />

            {(selected.link || selected.github) && (
              <div className="flex gap-3 mt-8">
                {selected.link && (
                  <a href={selected.link} target="_blank" rel="noopener noreferrer" className="btn btn-wax">
                    <ExternalLink className="w-4 h-4" /> Visit
                  </a>
                )}
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
                    <Github className="w-4 h-4" /> Source
                  </a>
                )}
              </div>
            )}
          </article>
        )}
      </NoteDialog>
    </Section>
  );
}
