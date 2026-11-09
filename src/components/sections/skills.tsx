import { resume } from "@/data/profile";
import { Section, SectionTitle } from "@/components/ui/section";

export function Skills() {
  const groups = Object.entries(resume.skills);
  return (
    <Section id="stack">
      <SectionTitle title="Stack" note="Everything from the resume, grouped the way I reach for it." />
      <div className="card p-6 md:p-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-10">
          {groups.map(([name, items]) => (
            <section key={name} className="break-inside-avoid mb-8">
              <h3 className="label flex items-baseline justify-between border-b border-line/10 pb-2 mb-3">
                {name}
                <span className="tabular-nums">{items.length}</span>
              </h3>
              <ul className="text-[0.95rem] text-text-soft leading-relaxed">
                {items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
