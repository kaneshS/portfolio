"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact-form";

const links = [
  [profile.github, "GitHub"],
  [profile.linkedin, "LinkedIn"],
  [profile.medium, "Medium"],
  [profile.resume, "Resume (PDF)"],
];

export function Contact() {
  const [open, setOpen] = useState(false);

  return (
    <Section id="contact" className="border-t border-rule">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)]">Let&rsquo;s build something.</h2>
          <p className="text-ink-soft mt-5 max-w-[46ch] text-lg">
            Senior backend roles, consulting, or a conversation about distributed systems. Replies within two days.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setOpen(true)} className="btn btn-primary" aria-haspopup="dialog">
              Send a message
            </button>
            <a href={`mailto:${profile.email}`} className="btn btn-ghost">
              {profile.email}
            </a>
          </div>
        </div>

        <ul className="lg:col-span-5 lg:pt-3 lg:justify-self-end flex flex-col">
          {links.map(([href, label]) => (
            <li key={label} className="border-b border-rule last:border-b-0">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-8 py-3.5 min-h-[44px] text-ink-soft hover:text-ink transition-colors lg:min-w-[16rem]"
              >
                {label}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <ContactForm isOpen={open} onClose={() => setOpen(false)} />
    </Section>
  );
}
