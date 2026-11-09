"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import posthog from "posthog-js";
import { projects, freelanceProjects, resume, type Project } from "@/data/profile";
import { Section, Heading } from "@/components/ui/section";
import { InlineList } from "@/components/ui/badge";
import { Mermaid } from "@/components/ui/mermaid";
import { Dialog } from "@/components/ui/dialog";

/* The two biggest numbers get panels; everything else is a row. */
const featured = [
  { id: "intract-rewind", value: "$600K+", caption: "NFT mint revenue within 2 weeks of the Intract Rewind launch" },
  { id: "telegram-backend", value: "~5M", caption: "Telegram users on one serverless Go backend, 40K+ daily active" },
];

const rowMetric: Record<string, string> = {
  "ai-image-pipeline": "200K+ images/day",
  "web3-assistant": "5+ agents, <1s",
};

// resume.projects not already covered by a curated project
const also = resume.projects.filter((p) => !["ai-web3-assistant", "blockchain-analytics"].includes(p.id));

export function Work() {
  const [selected, setSelected] = useState<Project | null>(null);

  const open = (p: Project) => {
    posthog.capture("project_modal_opened", { project_id: p.id, project_title: p.title });
    setSelected(p);
  };

  const byId = (id: string) => projects.find((p) => p.id === id)!;
  const rows = projects.filter((p) => !featured.some((f) => f.id === p.id));

  return (
    <Section id="work">
      <Heading sub="Six years of backend work, measured by what it carried.">
        Real load. <span className="text-accent">Real numbers.</span>
      </Heading>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {featured.map((f) => {
          const p = byId(f.id);
          return (
            <button key={f.id} onClick={() => open(p)} className="panel lift text-left flex flex-col min-h-[16rem]" aria-haspopup="dialog">
              <span className="meta">{p.title}</span>
              <span className="mt-auto pt-8 block text-[clamp(3rem,6vw,4.5rem)] font-medium tracking-tight leading-none tabular-nums text-ink">{f.value}</span>
              <span className="mt-3 block text-ink-soft max-w-[32ch]">{f.caption}</span>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink">
                The system <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-10 border-b border-rule">
        {rows.map((p) => (
          <li key={p.id}>
            <button onClick={() => open(p)} className="row grid-cols-[1fr_auto] md:grid-cols-[1.2fr_1fr_1.6fr_auto] gap-x-6 gap-y-1 items-baseline" aria-haspopup="dialog">
              <span className="font-medium text-ink">{p.title}</span>
              <span className="md:order-none order-3 col-span-2 md:col-span-1 text-xl lg:text-2xl tracking-tight tabular-nums text-ink whitespace-nowrap">{rowMetric[p.id] ?? p.metrics[0].value}</span>
              <span className="hidden md:block text-ink-soft text-[0.95rem]">{p.description}</span>
              <ArrowUpRight className="w-5 h-5 text-ink-soft justify-self-end" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-12">
        <div>
          <h3 className="text-xl">Also built</h3>
          <ul className="mt-5 space-y-5">
            {also.map((p) => (
              <li key={p.id}>
                <p className="font-medium text-ink">{p.title}</p>
                <p className="text-ink-soft text-[0.95rem] mt-1">{p.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl">On the side</h3>
          <ul className="mt-5 space-y-5">
            {freelanceProjects.map((f) => (
              <li key={f.id}>
                <p className="meta">{f.client} · {f.period}</p>
                <p className="font-medium text-ink mt-1">{f.title}</p>
                <p className="text-ink-soft text-[0.95rem] mt-1">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)} title={selected?.title ?? "Project"}>
        {selected && (
          <article>
            <h2 className="text-3xl pr-10">{selected.title}</h2>
            <p className="text-ink-soft mt-2">{selected.description}</p>

            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-rule pt-5">
              {selected.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="text-2xl font-medium tracking-tight tabular-nums text-ink">{m.value}</dd>
                  <dt className="meta mt-1">{m.label}</dt>
                </div>
              ))}
            </dl>

            <h3 className="text-base font-medium mt-8 mb-2">Problem</h3>
            <p className="text-ink-soft">{selected.problem}</p>

            <h3 className="text-base font-medium mt-8 mb-2">Architecture</h3>
            <p className="text-ink-soft mb-4">{selected.architecture}</p>
            {selected.architectureDiagram && (
              <div className="panel !p-3">
                <Mermaid chart={selected.architectureDiagram} />
              </div>
            )}

            <h3 className="text-base font-medium mt-8 mb-2">Stack</h3>
            <InlineList items={selected.technologies} />
          </article>
        )}
      </Dialog>
    </Section>
  );
}
