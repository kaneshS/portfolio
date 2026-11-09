"use client";

import { useState } from "react";
import { resume } from "@/data/profile";
import { ContactForm } from "@/components/contact-form";
import { SystemDiagram } from "@/components/system-diagram";

const words = ["Pipelines.", "Platforms.", "Scale."];
const sentence = resume.summary.split(". ")[0] + ".";

export function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <section className="pt-32 md:pt-40 pb-20 md:pb-28" aria-labelledby="hero-title">
      <div className="container grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className="text-[clamp(3rem,9vw,6rem)] leading-[1.02]">
            {words.map((w, i) => (
              <span key={w} className="reveal">
                <span style={{ ["--i" as string]: i }}>{w}</span>
              </span>
            ))}
          </h1>

          <p className="fade-up mt-8 max-w-[52ch] text-ink-soft text-lg md:text-xl leading-relaxed">{sentence}</p>

          <div className="fade-up mt-9" style={{ ["--d" as string]: "520ms" }}>
            <button onClick={() => setOpen(true)} className="btn btn-primary" aria-haspopup="dialog">
              Start a conversation →
            </button>
            <p className="mt-5 text-sm text-ink-soft">Open to senior backend roles</p>
          </div>
        </div>

        <div className="fade-up lg:col-span-5 text-ink" style={{ ["--d" as string]: "600ms" }}>
          <SystemDiagram className="w-full h-auto max-w-[36rem] mx-auto lg:ml-auto" />
        </div>
      </div>

      <ContactForm isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}
