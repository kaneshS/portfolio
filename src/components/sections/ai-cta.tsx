import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Frame } from "@/components/ui/ornaments";

const sample = ["What scale has he worked at?", "Tell me about the AWS to GCP migration", "Which databases, and why?"];

export function AICta() {
  return (
    <Section id="ai" className="pt-0">
      <Frame className="p-8 md:p-12 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <h2 className="text-3xl md:text-4xl">Ask the map</h2>
          <p className="text-ink-soft mt-3 max-w-[52ch]">
            The map answers questions about this work in its own words. It reads only what is written here, so it will say so when it does not know.
          </p>
          <Link href="/ai" className="btn btn-wax mt-6">
            Open the conversation
          </Link>
        </div>
        <ul className="md:col-span-5 space-y-2">
          {sample.map((q) => (
            <li key={q} className="font-hand text-xl text-ink-soft">“{q}”</li>
          ))}
        </ul>
      </Frame>
    </Section>
  );
}
