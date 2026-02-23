"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section, SectionHeader } from "@/components/ui/section";
import { profile } from "@/data/profile";
import { ExperienceJourney } from "./experience-journey";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function calculateYearsOfExperience(): string {
  const startDate = new Date(2020, 8, 1); // September 2020 (month is 0-indexed)
  const now = new Date();
  
  const totalMonths =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  // If months >= 8, round up to next year
  const displayYears = months >= 8 ? years + 1 : years;
  
  return `${displayYears}+`;
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const yearsOfExperience = useMemo(() => calculateYearsOfExperience(), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate narrative from left
      gsap.fromTo(
        narrativeRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: narrativeRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate stats from right
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate each stat card
      const statCards = statsRef.current?.querySelectorAll(".stat-card");
      if (statCards) {
        gsap.fromTo(
          statCards,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef} id="about" className="bg-muted/30">
      <SectionHeader
        title="About Me"
        subtitle="A journey of building systems that scale"
      />

      <div className="grid lg:grid-cols-2 gap-16 mb-16">
        {/* Narrative */}
        <div ref={narrativeRef} className="space-y-6">
          {profile.aboutMe.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="text-muted-foreground leading-relaxed">
              {paragraph.trim()}
            </p>
          ))}
        </div>

        {/* Quick stats */}
        <div ref={statsRef} className="flex flex-wrap gap-4 content-start">
          {[
            { label: "Years Experience", value: yearsOfExperience },
            { label: "Users Served", value: "5M+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="stat-card px-5 py-3 rounded-lg bg-card border border-border inline-flex items-center gap-3"
            >
              <div className="text-2xl font-bold text-accent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Journey - Horizontal Timeline */}
      <ExperienceJourney />
    </Section>
  );
}
