import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FlowDiagram, type FlowSpec } from "@/components/ui/flow-diagram";

/* The hero diagram is the real Spyne pipeline: Kafka topic, workers autoscaled on lag, Redis, FastAPI. */
const pipeline: FlowSpec = {
  cols: 4,
  rows: 3,
  nodes: [
    { id: "kafka", label: "Kafka topic", sub: "200K+ images/day", col: 0, row: 1 },
    { id: "w1", label: "Worker", sub: "multiprocessing", col: 1, row: 0 },
    { id: "w2", label: "Worker", sub: "multiprocessing", col: 1, row: 1 },
    { id: "w3", label: "Worker", sub: "scaled on lag", col: 1, row: 2, dashed: true },
    { id: "redis", label: "Redis", sub: "-60% db load", col: 2, row: 1 },
    { id: "api", label: "FastAPI", sub: "<100ms p95", col: 3, row: 1 },
  ],
  edges: [
    ["kafka", "w1"],
    ["kafka", "w2"],
    ["kafka", "w3"],
    ["w1", "redis"],
    ["w2", "redis"],
    ["w3", "redis"],
    ["redis", "api"],
  ],
};

const stats = [
  ["6+", "years in production"],
  ["~5M", "users on one Go backend"],
  ["200K+", "images a day through Kafka"],
  ["$600K+", "from one launch, in 2 weeks"],
];

export function Hero() {
  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-20" aria-labelledby="hero-title">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 text-sm text-text-soft" style={{ animation: "fade-in 600ms ease both" }}>
              <span className="w-2 h-2 rounded-full bg-accent pulse-dot" aria-hidden="true" />
              Open to senior engineering roles · Gurugram / remote
            </p>

            <h1 id="hero-title" className="mt-5 text-[clamp(2.75rem,6.4vw,5rem)]">
              <span className="reveal block">
                <span className="block" style={{ ["--i" as string]: 1 }}>Products that</span>
              </span>
              <span className="reveal block">
                <span className="block" style={{ ["--i" as string]: 2 }}>
                  hold at <em className="not-italic text-accent">scale.</em>
                </span>
              </span>
            </h1>

            <div className="reveal mt-6">
              <p className="text-text-soft text-lg md:text-xl max-w-[46ch]" style={{ ["--i" as string]: 3 }}>
                Senior full-stack engineer. Python and Go services, event-driven pipelines, React and Next.js in front, AWS and GCP underneath.
              </p>
            </div>

            <div className="reveal mt-8">
              <div className="flex flex-wrap gap-3" style={{ ["--i" as string]: 4 }}>
                <Link href="#contact" className="btn btn-accent">
                  Start a conversation <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#work" className="btn btn-line">
                  See the work
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="card p-4 md:p-6 reveal">
              <div style={{ ["--i" as string]: 3 }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="label">Image pipeline · Spyne.ai</span>
                  <span className="label text-accent">live</span>
                </div>
                <FlowDiagram spec={pipeline} title="Kafka topic feeding three workers, one autoscaled on consumer lag, into Redis and a FastAPI layer" />
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 border-t border-line/10 pt-8">
          {stats.map(([v, l]) => (
            <div key={l}>
              <dt className="font-display text-3xl md:text-4xl tabular-nums tracking-tight">{v}</dt>
              <dd className="text-sm text-text-soft mt-1">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
