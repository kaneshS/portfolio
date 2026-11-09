import { resume } from "@/data/profile";
import { Section, Banner } from "@/components/ui/section";
import { Frame } from "@/components/ui/ornaments";

/* The Inventory: a ledger, not chips. Every skill group from the resume, in columns. */
export function Skills() {
  const groups = Object.entries(resume.skills);
  return (
    <Section id="skills">
      <Banner title="The Inventory" note="what I carry into every build" />

      <Frame paper className="p-6 md:p-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-10 [column-fill:balance]">
          {groups.map(([name, items]) => (
            <section key={name} className="break-inside-avoid mb-8">
              <h3 className="font-display text-base text-ink border-b border-rule/60 pb-1 mb-2 flex items-baseline justify-between">
                {name}
                <span className="text-xs text-ink-faint tabular-nums">{items.length}</span>
              </h3>
              <ul className="text-[0.95rem] text-ink-soft leading-relaxed">
                {items.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-ink-faint" aria-hidden="true">·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Frame>

      <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl">
        {[
          ["Event-driven first", "Kafka, SQS, Kinesis and Redis Pub/Sub before a cron job and a shared table."],
          ["Cost is a feature", "Right-sized instances, caching, and autoscaling on real signals cut 35–40% off two cloud bills."],
          ["Tests behind gates", "pytest against mocked dependencies, coverage gates in CI, Prometheus and Grafana on the other side."],
        ].map(([t, d]) => (
          <div key={t}>
            <h3 className="font-display text-lg">{t}</h3>
            <p className="text-ink-soft text-[0.95rem] mt-1">{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
