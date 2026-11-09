import Link from "next/link";
import { profile } from "@/data/profile";
import { Compass, Trail, Frame } from "@/components/ui/ornaments";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center pt-24 pb-16 overflow-hidden" aria-labelledby="hero-title">
      <div className="container grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8">
          <p className="ink-in font-display text-ink-soft text-[0.95rem] md:text-base tracking-wide">
            Messrs. Python, Go, Kafka &amp; Postgres, purveyors of aids to scalable systems, are proud to present
          </p>

          <h1 id="hero-title" className="ink-in mt-5 text-[clamp(2.6rem,7.5vw,5.6rem)] leading-[0.98]" data-delay="1">
            The Marauder&rsquo;s Map
            <span className="block text-[0.42em] text-ink-soft mt-3">of {profile.name}, {profile.title}</span>
          </h1>

          <p className="ink-in mt-7 max-w-[62ch] text-ink-soft text-lg md:text-xl" data-delay="2">
            Six years of Python and Go backends that carry real load: a Kafka pipeline processing 200K+ images a day, a serverless Go backend for ~5M Telegram users, and a multi‑chain analytics launch that made $600K+ in two weeks.
          </p>

          <div className="ink-in mt-9 flex flex-wrap gap-3" data-delay="3">
            <Link href="#journey" className="btn btn-wax">
              Explore the map
            </Link>
            <Link href="/ai" className="btn btn-ink">
              Ask the map
            </Link>
          </div>

          <p className="margin-note mt-10 inline-block">
            Currently in {profile.location} — open to senior backend roles.
          </p>
        </div>

        <div className="hidden lg:flex lg:col-span-4 flex-col items-end gap-8 ink-in" data-delay="3">
          <Compass className="w-56 xl:w-64 text-ink-faint pointer-events-none select-none mr-6" />
          <Frame paper className="max-w-xs">
            <p className="font-display text-sm text-ink mb-3">Legend</p>
            <dl className="text-[0.95rem] text-ink-soft space-y-2">
              <div className="flex items-center gap-3"><span className="w-8 h-4 border border-rule/80" aria-hidden="true" /><dd>a chamber: one system, one problem</dd></div>
              <div className="flex items-center gap-3"><span className="w-8 border-t border-dashed border-rule" aria-hidden="true" /><dd>a corridor: a year in a role</dd></div>
              <div className="flex items-center gap-3"><span className="w-8 text-center text-ink font-display" aria-hidden="true">· ·</span><dd>footprints: where I have been</dd></div>
            </dl>
          </Frame>
        </div>
      </div>

      <Trail steps={4} className="absolute left-1/2 -translate-x-1/2 bottom-4 in-view opacity-70" />
    </section>
  );
}
