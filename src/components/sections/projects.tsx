"use client";

import { useState } from "react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import posthog from "posthog-js";
import { projects, freelanceProjects, type Project } from "@/data/profile";
import { Section, SectionTitle } from "@/components/ui/section";
import { Chips } from "@/components/ui/badge";
import { Mermaid } from "@/components/ui/mermaid";
import { Dialog } from "@/components/ui/dialog";
import { FlowDiagram, lanes, type FlowSpec } from "@/components/ui/flow-diagram";

/* Authored diagrams per project; facts match profile.ts. */
const flows: Record<string, FlowSpec> = {
  "intract-rewind": lanes([["16 chains", "parallel fetchers"], ["Normalize", "one schema"], ["Aggregate", "per wallet"], ["Analytics API", "$600K+ launch"]]),
  "telegram-backend": lanes([["API Gateway", "~5M users"], ["Lambda", "Go runtime"], ["Kinesis", "40K DAU"], ["MongoDB", "processors"]]),
  "ai-image-pipeline": lanes([["Upload", "50+ clients"], ["Kafka", "200K+/day"], ["Workers", "autoscaled"], ["Delivery", "<100ms API"]]),
  "web3-assistant": {
    cols: 4,
    rows: 3,
    nodes: [
      { id: "q", label: "Wallet query", sub: "MetaMask", col: 0, row: 1 },
      { id: "r", label: "Router", sub: "intent", col: 1, row: 1 },
      { id: "a1", label: "RAG agent", sub: "ChromaDB", col: 2, row: 0 },
      { id: "a2", label: "Chain agent", sub: "on-chain", col: 2, row: 1 },
      { id: "a3", label: "Social agent", col: 2, row: 2 },
      { id: "s", label: "SSE stream", sub: "<1s", col: 3, row: 1 },
    ],
    edges: [["q", "r"], ["r", "a1"], ["r", "a2"], ["r", "a3"], ["a1", "s"], ["a2", "s"], ["a3", "s"]],
  },
};

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  const open = (p: Project) => {
    posthog.capture("project_modal_opened", { project_id: p.id, project_title: p.title });
    setSelected(p);
  };

  return (
    <Section id="work">
      <SectionTitle title="Selected work" note="Systems that carried real load. Each one opens with the problem, the architecture and the numbers." />

      <div className="grid lg:grid-cols-2 gap-4 md:gap-5">
        {projects.map((p) => (
          <button key={p.id} onClick={() => open(p)} className="card lift text-left p-5 md:p-6 flex flex-col group" aria-haspopup="dialog">
            <div className="card-inset p-3 md:p-4 overflow-hidden">
              <FlowDiagram spec={flows[p.id]} title={`${p.title} architecture`} packets={false} compact />
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl">{p.title}</h3>
                <p className="text-text-soft mt-1 text-[0.95rem]">{p.description}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 shrink-0 text-text-faint group-hover:text-accent transition-colors mt-1" />
            </div>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {p.metrics.slice(0, 3).map((m) => (
                <div key={m.label}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="font-display text-xl tabular-nums leading-none">{m.value}</dd>
                  <dd className="label mt-1 normal-case tracking-normal text-[0.72rem]">{m.label}</dd>
                </div>
              ))}
            </dl>
            <Chips items={p.technologies.slice(0, 5)} className="mt-auto pt-5" />
          </button>
        ))}
      </div>

      <div className="mt-12 md:mt-16 border-t border-line/10 pt-8">
        <span className="label">Also built</span>
        <ul className="mt-4 divide-y divide-line/10">
          {freelanceProjects.map((f) => (
            <li key={f.id} className="py-4 grid md:grid-cols-12 gap-2 md:gap-6">
              <div className="md:col-span-4">
                <p className="font-display text-lg leading-tight">{f.title}</p>
                <p className="text-sm text-text-faint">{f.client} · {f.period}</p>
              </div>
              <p className="md:col-span-5 text-[0.95rem] text-text-soft">{f.description}</p>
              <p className="md:col-span-3 font-mono text-xs text-text-faint md:text-right">{f.technologies.slice(0, 4).join(" · ")}</p>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)} title={selected?.title ?? "Project"}>
        {selected && (
          <article>
            <h2 className="font-display text-3xl pr-10">{selected.title}</h2>
            <p className="text-text-soft mt-2">{selected.description}</p>

            <dl className="mt-6 grid grid-cols-3 gap-4 card-inset p-4">
              {selected.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="font-display text-2xl tabular-nums">{m.value}</dd>
                  <dt className="label mt-1">{m.label}</dt>
                </div>
              ))}
            </dl>

            <h3 className="label mt-8 mb-2">The problem</h3>
            <p className="text-text-soft">{selected.problem}</p>

            <h3 className="label mt-8 mb-2">Architecture</h3>
            <p className="text-text-soft mb-4">{selected.architecture}</p>
            {selected.architectureDiagram && (
              <div className="card-inset p-3">
                <Mermaid chart={selected.architectureDiagram} />
              </div>
            )}

            <h3 className="label mt-8 mb-3">Built with</h3>
            <Chips items={selected.technologies} />

            {(selected.link || selected.github) && (
              <div className="flex gap-3 mt-8">
                {selected.link && (
                  <a href={selected.link} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                    <ExternalLink className="w-4 h-4" /> Visit
                  </a>
                )}
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                    <Github className="w-4 h-4" /> Source
                  </a>
                )}
              </div>
            )}
          </article>
        )}
      </Dialog>
    </Section>
  );
}
