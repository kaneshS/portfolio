import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile, resume } from "@/data/profile";

/* Phrases from the resume summary that take the accent. Everything else stays off-white. */
const highlights = ["Python (FastAPI) and Go REST APIs", "event-driven microservices", "200K+ images/day", "$600K+ in NFT mint revenue"];

function Highlighted({ text }: { text: string }) {
  const re = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return (
    <>
      {text.split(re).map((part, i) => (highlights.includes(part) ? <span key={i} className="text-accent">{part}</span> : part))}
    </>
  );
}

export function Hero() {
  // first two sentences of the summary
  const summary = resume.summary.split(/(?<=\.)\s+/).slice(0, 2).join(" ");
  const name = "Kanesh";

  return (
    <section className="pt-32 pb-12 md:pt-40 md:pb-16" aria-labelledby="hero-title">
      <div className="container max-w-3xl">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-rule bg-surface px-3 py-1.5 text-[0.75rem] text-fg-dim">
          <span className="dot" aria-hidden="true" />
          <span className="text-accent font-medium tracking-[0.08em]">AVAILABLE</span>
          <span aria-hidden="true">·</span>
          open to senior backend roles
        </p>

        <h1 id="hero-title" className="mt-7 text-[clamp(2.25rem,7vw,4rem)] leading-[1.1] font-medium" translate="no">
          <span className="prompt">$</span> hi, I&rsquo;m
          <br />
          <span className="typed" style={{ ["--n" as string]: `${name.length}ch`, ["--steps" as string]: name.length }}>
            {name}
          </span>
          <span className="caret" aria-hidden="true" />
        </h1>

        <p className="mt-6 text-fg-dim text-[0.95rem] md:text-base">
          {profile.title} <span className="text-fg-faint" aria-hidden="true">|</span> Python &amp; Go <span className="text-fg-faint" aria-hidden="true">|</span> Gurugram ↔ Remote
        </p>

        <p className="mt-6 max-w-[62ch] text-fg leading-relaxed">
          <Highlighted text={summary} />
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#contact" className="btn btn-primary">→ get in touch</a>
          <Link href="#work" className="btn btn-ghost">
            <span className="prompt">$</span> ls projects/
          </Link>
          <ul className="flex items-center gap-1 sm:ml-2">
            {[
              [profile.github, "GitHub", Github],
              [profile.linkedin, "LinkedIn", Linkedin],
              [`mailto:${profile.email}`, "Email", Mail],
            ].map(([href, label, Icon]) => {
              const I = Icon as typeof Github;
              return (
                <li key={label as string}>
                  <a href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string} className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded text-fg-dim hover:text-accent transition-colors duration-150">
                    <I className="w-[18px] h-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
