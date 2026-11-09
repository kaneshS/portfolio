import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";

export function AICta() {
  return (
    <Section id="ai" className="pt-0">
      <div className="panel md:!p-12 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)]">Ask the assistant instead of reading.</h2>
          <p className="text-ink-soft mt-3 max-w-[52ch]">
            It answers from this resume and nothing else, so it will tell you when it does not know.
          </p>
        </div>
        <div className="md:col-span-4 md:justify-self-end">
          <Link href="/ai" className="btn btn-primary">
            Open the assistant <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
