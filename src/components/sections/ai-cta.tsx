"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";

const samples = ["What scale has he worked at?", "Walk me through the AWS to GCP migration", "Which databases, and why?"];

export function AICta() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = (text: string) => router.push(`/ai?q=${encodeURIComponent(text)}`);

  return (
    <Section id="ai" className="pt-0">
      <div className="card p-6 md:p-10 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <span className="label">Ask the assistant</span>
          <h2 className="mt-3 text-3xl md:text-4xl">Ask anything about this work.</h2>
          <p className="text-text-soft mt-3 max-w-[48ch]">It reads only what is on this site, so it says so when it does not know.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) go(q.trim());
            }}
            className="mt-6 flex gap-2"
          >
            <label htmlFor="ai-q" className="sr-only">Your question</label>
            <input id="ai-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about a system, a stack, a decision…" className="field" autoComplete="off" />
            <button type="submit" className="btn btn-accent shrink-0" aria-label="Ask">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
        <ul className="lg:col-span-6 grid gap-2">
          {samples.map((s) => (
            <li key={s}>
              <button onClick={() => go(s)} className="w-full text-left card-inset px-4 py-3 min-h-[44px] text-[0.95rem] text-text-soft hover:text-text hover:border-line/25 transition-colors">
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
