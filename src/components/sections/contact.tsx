"use client";

import { useState } from "react";
import { profile, resume } from "@/data/profile";
import { Section, SectionHead } from "@/components/ui/section";
import { ContactForm } from "@/components/contact-form";

const kv: [string, React.ReactNode][] = [
  ["location", `${profile.location} · IST`],
  ["status", <span key="s" className="text-accent">open to senior backend roles</span>],
  ["stack", "Python / Go / FastAPI / Postgres / Kafka / AWS & GCP"],
  ["github", <a key="g" href={profile.github} target="_blank" rel="noopener noreferrer" className="t-link">@{profile.github.split("/").pop()}</a>],
  ["linkedin", <a key="l" href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="t-link">in/{profile.linkedin.split("/").pop()}</a>],
  ["resume", <a key="r" href={resume.links.resume} target="_blank" rel="noopener noreferrer" className="t-link">Kaneshwar_Sharma.pdf</a>],
];

export function Contact() {
  const [open, setOpen] = useState(false);

  return (
    <Section id="contact">
      <SectionHead num="04" title="Get in touch" path="~/contact" />

      <h2 className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-medium">Let&rsquo;s build something.</h2>

      <a href={`mailto:${profile.email}`} className="group mt-8 inline-flex items-center gap-4 text-[clamp(1.1rem,3vw,1.6rem)] text-fg break-all">
        <span className="t-link group-hover:bg-[length:100%_1px]">{profile.email}</span>
        <span className="hidden sm:inline-block text-accent transition-transform duration-200 ease-out group-hover:translate-x-2" aria-hidden="true">⟶</span>
      </a>

      <div className="mt-10 grid md:grid-cols-[1fr_auto] gap-10 items-start">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.9rem]">
          {kv.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-fg-faint">{k}</dt>
              <dd className="text-fg-dim min-w-0 break-words">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="md:text-right">
          <p className="text-fg-faint text-[0.8rem] mb-3">prefer a form?</p>
          <button onClick={() => setOpen(true)} className="btn btn-primary" aria-haspopup="dialog">
            <span aria-hidden="true">$</span> send message
          </button>
        </div>
      </div>

      <ContactForm isOpen={open} onClose={() => setOpen(false)} />
    </Section>
  );
}
