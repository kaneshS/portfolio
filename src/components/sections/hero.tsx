"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, MessageSquare, Briefcase } from "lucide-react";
import { profile } from "@/data/profile";
import Link from "next/link";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".hero-badge", { opacity: 1, y: 0, duration: 0.6 })
        .to(".hero-headline", { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
        .to(".hero-subtitle", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .to(".hero-tech", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");

      // Subtle parallax on scroll (no opacity change)
      gsap.to(".hero-content", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Simple dark background */}
      <div className="absolute inset-0 -z-10 bg-background" />

      <div className="container mx-auto px-6 py-32">
        <div className="hero-content max-w-4xl mx-auto text-center">
          {/* Status badge */}
          <div className="hero-badge mb-8 opacity-0 translate-y-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Available for opportunities
            </span>
          </div>

          {/* Main headline */}
          <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 opacity-0 translate-y-10">
            Building{" "}
            <span className="text-accent">scalable systems</span>
            <br />
            that power millions
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 translate-y-8">
            {profile.title} specializing in distributed systems, cloud
            infrastructure, and real-time data pipelines. I design backend
            architectures that handle scale with elegance.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-wrap items-center justify-center gap-4 opacity-0 translate-y-5">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              View Work
            </Link>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 px-6 py-3 bg-muted border border-border rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Talk to my AI
            </Link>
          </div>

          {/* Tech stack preview */}
          <div className="hero-tech mt-16 pt-16 border-t border-border opacity-0 translate-y-5">
            <p className="text-sm text-muted-foreground mb-4">
              Technologies I work with
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-muted-foreground max-w-xs sm:max-w-none mx-auto sm:flex-nowrap">
              {["Python", "TypeScript", "FastAPI", "Kafka", "AWS", "GCP", "Docker", "PostgreSQL", "Redis", "Go"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm border border-border rounded-md hover:border-accent/50 transition-colors"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
