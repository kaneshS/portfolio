"use client";

import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import posthog from "posthog-js";
import { projects, type Project } from "@/data/profile";
import { Section, SectionHead } from "@/components/ui/section";
import { Mermaid } from "@/components/ui/mermaid";
import { TermDialog } from "@/components/ui/dialog";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  const open = (p: Project) => {
    posthog.capture("project_modal_opened", { project_id: p.id, project_title: p.title });
    setSelected(p);
  };

  return (
    <Section id="work">
      <SectionHead num="01" title="Featured work" path="~/projects/featured">
        <p className="mt-6 text-fg-dim text-[0.9rem]">
          <span className="prompt">$</span> ls -al projects/ <span className="text-fg-faint">{"// "}{projects.length} entries, each opens a dialog</span>
        </p>
      </SectionHead>

      <ul>
        {projects.map((p) => {
          const m = p.metrics[0];
          return (
            <li key={p.id}>
              <button onClick={() => open(p)} className="row grid-cols-[1fr_auto] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto]" aria-haspopup="dialog">
                <span className="min-w-0">
                  <span className="block text-fg font-medium truncate">{p.title}</span>
                  <span className="block md:hidden text-fg-dim text-[0.85rem] mt-0.5">{m.value} {m.label.toLowerCase()}</span>
                </span>
                <span className="hidden md:block text-fg-dim text-[0.9rem] truncate">
                  <span className="text-fg">{m.value}</span> {m.label.toLowerCase()}
                </span>
                <span className="hidden md:block text-fg-faint text-[0.85rem] truncate">{p.technologies.slice(0, 4).join(" · ")}</span>
                <span className="arrow text-fg-faint" aria-hidden="true">↗</span>
                <span className="col-span-2 md:hidden text-fg-faint text-[0.8rem] truncate">{p.technologies.slice(0, 4).join(" · ")}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <TermDialog open={!!selected} onClose={() => setSelected(null)} title={selected ? `~/projects/${selected.id}` : "project"}>
        {selected && (
          <article>
            <h2 className="text-2xl font-medium">{selected.title}</h2>
            <p className="text-fg-dim mt-2">{selected.description}</p>

            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-rule pt-5">
              {selected.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="text-xl text-fg">{m.value}</dd>
                  <dt className="text-xs text-fg-faint">{m.label}</dt>
                </div>
              ))}
            </dl>

            <h3 className="text-xs uppercase tracking-[0.08em] text-fg-faint mt-8 mb-2"><span className="prompt">#</span> problem</h3>
            <p className="text-fg-dim">{selected.problem}</p>

            <h3 className="text-xs uppercase tracking-[0.08em] text-fg-faint mt-8 mb-2"><span className="prompt">#</span> architecture</h3>
            <p className="text-fg-dim mb-4">{selected.architecture}</p>
            {selected.architectureDiagram && (
              <div className="border border-rule rounded bg-bg p-3">
                <Mermaid chart={selected.architectureDiagram} />
              </div>
            )}

            <h3 className="text-xs uppercase tracking-[0.08em] text-fg-faint mt-8 mb-2"><span className="prompt">#</span> stack</h3>
            <p className="text-fg-dim">{selected.technologies.join(" · ")}</p>

            {(selected.link || selected.github) && (
              <div className="flex gap-3 mt-8">
                {selected.link && (
                  <a href={selected.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <ExternalLink className="w-4 h-4" /> visit
                  </a>
                )}
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <Github className="w-4 h-4" /> source
                  </a>
                )}
              </div>
            )}
          </article>
        )}
      </TermDialog>
    </Section>
  );
}
