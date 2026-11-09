"use client";

import { useState } from "react";
import { Github, Linkedin, Mail, FileText, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact-form";

export function Contact() {
  const [open, setOpen] = useState(false);

  return (
    <Section id="contact">
      <div className="max-w-4xl">
        <span className="label">Contact</span>
        <h2 className="mt-3 text-[clamp(2.4rem,6vw,4.5rem)]">Let&rsquo;s build something that holds.</h2>
        <p className="text-text-soft mt-5 max-w-[50ch] text-lg">Senior engineering roles, consulting, or a conversation about a system that is starting to creak. Replies within two days.</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => setOpen(true)} className="btn btn-accent" aria-haspopup="dialog">
            Send a message
          </button>
          <a href={`mailto:${profile.email}`} className="btn btn-line">
            <Mail className="w-4 h-4" /> {profile.email}
          </a>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[0.95rem]">
          {[
            [profile.github, "GitHub", Github],
            [profile.linkedin, "LinkedIn", Linkedin],
            [profile.resume, "Resume (PDF)", FileText],
          ].map(([href, label, Icon]) => {
            const I = Icon as typeof Github;
            return (
              <li key={label as string}>
                <a href={href as string} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-2 text-text-soft hover:text-text py-2">
                  <I className="w-4 h-4" /> {label as string} <ArrowUpRight className="w-3.5 h-3.5 text-text-faint" />
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
