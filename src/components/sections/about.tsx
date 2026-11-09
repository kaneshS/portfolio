import { Section, Banner } from "@/components/ui/section";
import { profile, education } from "@/data/profile";
import { WaxSeal } from "@/components/ui/ornaments";

function yearsSince(y: number, m: number) {
  const now = new Date();
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() - m);
  return `${Math.floor(months / 12)}+`;
}

export function About() {
  return (
    <Section id="about">
      <Banner title="The Walker" note="who is making these footprints" />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-ink-soft max-w-[66ch] text-[1.05rem] md:text-lg">
          {profile.aboutMe.split("\n\n").map((p, i) => (
            <p key={i} className={i === 0 ? "first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.8] first-letter:text-ink" : ""}>
              {p.trim()}
            </p>
          ))}
        </div>

        <aside className="lg:col-span-5 lg:pl-8 lg:border-l border-rule/50 space-y-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
            {[
              [yearsSince(2020, 8), "years in production"],
              ["5M", "users on one Go backend"],
              ["50+", "enterprise API clients"],
              ["$600K+", "from one launch, in 2 weeks"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl md:text-4xl text-ink tabular-nums">{v}</dt>
                <dd className="text-sm text-ink-soft mt-1">{l}</dd>
              </div>
            ))}
          </dl>

          <div className="rule-dashed pt-6 flex items-start gap-4">
            <WaxSeal className="w-14 h-14 shrink-0" letter="B" />
            <div>
              <p className="font-display text-ink">{education.university}</p>
              <p className="text-sm text-ink-soft">{education.degree}</p>
              <p className="text-sm text-ink-faint">{education.location} · {education.period}</p>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
