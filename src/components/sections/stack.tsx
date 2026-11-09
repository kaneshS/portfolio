import { resume } from "@/data/profile";
import { Section, SectionHead } from "@/components/ui/section";

/* Every skill group from resume.json, rendered like `tree` output. */
export function Stack() {
  const groups = Object.entries(resume.skills);
  return (
    <Section id="stack">
      <SectionHead num="03" title="Stack" path="~/stack">
        <p className="mt-6 text-fg-dim text-[0.9rem]">
          <span className="prompt">$</span> tree stack/ <span className="text-fg-faint">{"// "}{groups.length} directories, {groups.reduce((n, [, v]) => n + v.length, 0)} files</span>
        </p>
      </SectionHead>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-10 text-[0.9rem]">
        {groups.map(([name, items]) => (
          <section key={name} className="break-inside-avoid mb-7">
            <h3 className="text-fg font-medium text-[0.9rem] mb-1" translate="no">
              {name}<span className="text-fg-faint">/</span>
            </h3>
            <ul className="tree">
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
