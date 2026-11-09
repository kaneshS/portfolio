import { freelanceProjects } from "@/data/profile";
import { Section, Banner } from "@/components/ui/section";
import { InkList } from "@/components/ui/badge";

export function Freelance() {
  return (
    <Section id="freelance" className="pt-0">
      <Banner title="Secret Passages" note="side quests, taken on my own time" />

      <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 max-w-5xl">
        {freelanceProjects.map((f) => (
          <article key={f.id} className="relative pl-6 border-l border-dashed border-rule/70">
            <p className="font-display text-xs text-ink-faint tracking-widest uppercase">{f.client} · {f.period}</p>
            <h3 className="text-2xl mt-1">{f.title}</h3>
            <p className="text-ink-soft mt-3 text-[0.95rem]">{f.overview}</p>
            <ul className="mt-4 space-y-1.5 text-[0.95rem] text-ink-soft">
              {f.deliverables.slice(0, 4).map((d) => (
                <li key={d} className="pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-ink-faint">{d}</li>
              ))}
            </ul>
            <p className="font-hand text-lg text-wax mt-4">{f.outcome}</p>
            <InkList items={f.technologies} className="mt-3" />
          </article>
        ))}
      </div>
    </Section>
  );
}
