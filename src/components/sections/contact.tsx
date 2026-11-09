"use client";

import { useState } from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact-form";
import { WaxSeal } from "@/components/ui/ornaments";

export function Contact() {
  const [open, setOpen] = useState(false);

  return (
    <Section id="contact">
      <div className="max-w-3xl mx-auto text-center">
        <WaxSeal className="w-20 h-20 mx-auto" />
        <h2 className="text-4xl md:text-5xl mt-6">Owl Post</h2>
        <p className="text-ink-soft mt-4 max-w-[50ch] mx-auto">
          For senior backend roles, consulting, or a conversation about distributed systems. Letters are answered within two days.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => setOpen(true)} className="btn btn-wax" aria-haspopup="dialog">
            Send a letter
          </button>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
            <FileText className="w-4 h-4" /> Resume (PDF)
          </a>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 font-display text-[0.95rem]">
          {[
            [profile.github, "GitHub", Github],
            [profile.linkedin, "LinkedIn", Linkedin],
            [`mailto:${profile.email}`, "Email", Mail],
          ].map(([href, label, Icon]) => {
            const I = Icon as typeof Github;
            return (
              <li key={label as string}>
                <a href={href as string} target="_blank" rel="noopener noreferrer" className="ink-link inline-flex items-center gap-2 text-ink-soft hover:text-ink py-2">
                  <I className="w-4 h-4" /> {label as string}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <ContactForm isOpen={open} onClose={() => setOpen(false)} />
    </Section>
  );
}
