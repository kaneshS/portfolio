import { resume } from "@/data/profile";
import { Section, Heading } from "@/components/ui/section";

/* Every skill group from the resume, as plain lists in columns. No chips. */
export function Skills() {
  const groups = Object.entries(resume.skills);
  return (
    <Section id="skills">
      <Heading sub="Grouped the way the resume groups them.">
        What I <span className="text-accent">reach for.</span>
      </Heading>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 border-t border-rule pt-8">
        {groups.map(([name, items]) => (
          <section key={name}>
            <h3 className="text-base font-medium text-ink mb-3">{name}</h3>
            <ul className="text-[0.95rem] text-ink-soft leading-relaxed">
              {items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  );
}
