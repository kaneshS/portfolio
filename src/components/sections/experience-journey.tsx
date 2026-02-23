"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, X, MapPin, Calendar, CheckCircle2, GraduationCap } from "lucide-react";
import { experiences, Experience, education } from "@/data/profile";
import posthog from "posthog-js";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Foot SVG component
function FootSVG({ isLeft, className }: { isLeft: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 76 76"
      className={className}
      style={{ transform: isLeft ? "none" : "scaleX(-1)" }}
    >
      <path
        d="M 44.5,18.5C 45.8807,18.5 47,20.2909 47,22.5C 47,24.7091 45.8807,26.5 44.5,26.5C 43.1193,26.5 42,24.7091 42,22.5C 42,20.2909 43.1193,18.5 44.5,18.5 Z M 39.25,19.75C 40.0784,19.75 40.75,20.8693 40.75,22.25C 40.75,23.6307 40.0784,24.75 39.25,24.75C 38.4216,24.75 37.75,23.6307 37.75,22.25C 37.75,20.8693 38.4216,19.75 39.25,19.75 Z M 35,21C 35.8284,21 36.5,21.8954 36.5,23C 36.5,24.1046 35.8284,25 35,25C 34.1716,25 33.5,24.1046 33.5,23C 33.5,21.8954 34.1716,21 35,21 Z M 31.5,23.25C 32.3284,23.25 33,24.1454 33,25.25C 33,26.3546 32.3284,27.25 31.5,27.25C 30.6716,27.25 30,26.3546 30,25.25C 30,24.1454 30.6716,23.25 31.5,23.25 Z M 28.75,26.75C 29.3023,26.75 29.75,27.4216 29.75,28.25C 29.75,29.0784 29.3023,29.75 28.75,29.75C 28.1977,29.75 27.75,29.0784 27.75,28.25C 27.75,27.4216 28.1977,26.75 28.75,26.75 Z M 34,27.5C 43,23 49.2428,31.3086 42,40C 37,46 51.1334,55.5428 42,57.5C 35,59 37.1925,49.8978 35,46C 26,30 34,27.5 34,27.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ExperienceJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const footstepsRef = useRef<HTMLDivElement>(null);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedExp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedExp]);

  const handleExperienceClick = (exp: Experience) => {
    posthog.capture("experience_modal_opened", {
      company: exp.company,
      role: exp.role,
      period: exp.period,
    });
    setSelectedExp(exp);
  };

  // Reverse to show oldest first
  const reversedExperiences = [...experiences].reverse();

  // Generate footstep positions
  const footsteps = generateFootstepPositions();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        ".journey-header",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate Education node
      gsap.fromTo(
        ".education-node",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: ".education-node",
            start: "top 85%",
          },
        }
      );

      // Animate START node
      gsap.fromTo(
        ".start-node",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: ".start-node",
            start: "top 85%",
          },
        }
      );

      // Animate NOW node
      gsap.fromTo(
        ".now-node",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: ".now-node",
            start: "top 85%",
          },
        }
      );

      // Animate footsteps
      const footstepEls = footstepsRef.current?.querySelectorAll(".footstep");
      if (footstepEls) {
        const totalFootsteps = footstepEls.length;
        footstepEls.forEach((el, i) => {
          // Spread footsteps across 10% to 70% of scroll
          const startPercent = 10 + (i / totalFootsteps) * 60;
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.3 },
            {
              opacity: 0.7,
              scale: 1,
              duration: 0.2,
              scrollTrigger: {
                trigger: containerRef.current,
                start: `${startPercent}% 70%`,
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }

      // Animate experience items
      const expItems = containerRef.current?.querySelectorAll(".exp-item");
      if (expItems) {
        expItems.forEach((el, i) => {
          const isLeft = i % 2 === 0;
          gsap.fromTo(
            el,
            { opacity: 0, x: isLeft ? -40 : 40 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative mt-16 pb-20">
        {/* Header */}
        <div className="journey-header text-center mb-12">
          <p className="text-sm text-accent font-mono tracking-widest uppercase mb-2">
            ~ The Journey So Far ~
          </p>
          <h3 className="text-2xl font-bold">Career Path</h3>
        </div>

        {/* S-Curve Container */}
        <div className="relative max-w-4xl mx-auto px-4">
          {/* Education Section */}
          <div className="education-node relative mb-12 opacity-0">
            <div className="flex flex-col items-center">
              <span className="text-sm font-mono text-muted-foreground mb-2">{education.period}</span>
              <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center shadow-lg z-10 border-4 border-amber-200 mb-4">
                <GraduationCap className="w-7 h-7 text-amber-100" />
              </div>
              <div className="text-center max-w-sm">
                <h4 className="font-bold text-lg mb-1">{education.degree}</h4>
                <p className="text-accent text-sm font-medium mb-1">{education.university}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {education.location}
                </p>
              </div>
            </div>
          </div>

          {/* START Node - Career Begins */}
          <div className="start-node relative flex justify-center mb-8 opacity-0">
            <div className="flex flex-col items-center">
              <span className="text-sm font-mono text-muted-foreground mb-2">2020</span>
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg z-10 border-4 border-green-200">
                <span className="text-accent-foreground text-xs font-bold">START</span>
              </div>
              <span className="text-xs text-muted-foreground mt-2">Career Begins</span>
            </div>
          </div>

          {/* Career Journey with Footsteps - starts after START node */}
          <div className="relative">
            {/* Footsteps trail */}
            <div ref={footstepsRef} className="absolute inset-0 pointer-events-none">
              {footsteps.map((step, i) => (
                <div
                  key={i}
                  className="footstep absolute w-10 h-12 opacity-0"
                  style={{
                    left: step.x,
                    top: step.y,
                    transform: `translate(-50%, -50%) rotate(${step.rotation}deg)`,
                  }}
                >
                  <FootSVG isLeft={step.isLeft} className="w-full h-full text-accent" />
                </div>
              ))}
            </div>

            {/* Experience Items */}
          {reversedExperiences.map((exp, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <ExperienceItem
                key={exp.id}
                exp={exp}
                isLeft={isLeft}
                onClick={() => handleExperienceClick(exp)}
              />
            );
          })}

            {/* NOW Node */}
            <div className="now-node relative flex justify-center mt-8 opacity-0">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="relative w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center shadow-lg z-10 border-4 border-amber-200">
                    <span className="text-amber-100 text-xs font-bold">NOW</span>
                  </div>
                </div>
                <span className="text-sm font-mono text-muted-foreground mt-2">2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Detail Modal */}
      <AnimatePresence>
        {selectedExp && (
          <ExperienceModal exp={selectedExp} onClose={() => setSelectedExp(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// Experience Detail Modal
function ExperienceModal({ exp, onClose }: { exp: Experience; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-border bg-muted/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{exp.company}</h2>
              <p className="text-accent font-medium text-lg">{exp.role}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {exp.period}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {exp.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-foreground leading-relaxed">{exp.description}</p>
          </div>

          {/* Highlights */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Key Achievements
            </h3>
            <ul className="space-y-3">
              {exp.achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm rounded-lg bg-muted text-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Generate footstep positions along an S-curve
function generateFootstepPositions() {
  const steps: Array<{
    x: string;
    y: string;
    rotation: number;
    isLeft: boolean;
    progress: number;
  }> = [];
  
  const totalSteps = 40; // More steps for shorter stride
  
  for (let i = 0; i < totalSteps; i++) {
    const t = (i / (totalSteps - 1)) * 0.95;
    const isLeft = i % 2 === 0;
    
    let xPercent: number;
    const normalizedT = Math.min(t / 0.95, 0.999);
    const segment = Math.floor(normalizedT * 4);
    const segmentT = (normalizedT * 4) % 1;
    
    if (segment === 0) {
      xPercent = 50 + segmentT * 15;
    } else if (segment === 1) {
      xPercent = 65 - segmentT * 30;
    } else if (segment === 2) {
      xPercent = 35 + segmentT * 30;
    } else {
      xPercent = 65 - segmentT * 15;
    }
    
    // Tighter left/right offset for shorter stride
    xPercent += isLeft ? -1.5 : 1.5;
    
    let rotation = 180;
    if (segment === 0 || segment === 2) {
      rotation = 165;
    } else {
      rotation = 195;
    }
    
    steps.push({
      x: `${xPercent}%`,
      y: `${6 + t * 88}%`,
      rotation,
      isLeft,
      progress: t,
    });
  }
  
  return steps;
}

function ExperienceItem({
  exp,
  isLeft,
  onClick,
}: {
  exp: Experience;
  isLeft: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`exp-item relative flex items-center gap-4 py-12 ${
        isLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Card */}
      <div className={`flex-1 max-w-md ${isLeft ? "text-right" : "text-left"}`}>
        <div
          onClick={onClick}
          className={`p-5 rounded-xl bg-card border border-border hover:border-accent/50 transition-all shadow-lg cursor-pointer group ${
            isLeft ? "ml-auto" : "mr-auto"
          }`}
        >
          <div className={`flex items-center gap-2 mb-2 ${isLeft ? "justify-end" : "justify-start"}`}>
            <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
              {exp.period}
            </span>
          </div>
          
          <h4 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">{exp.company}</h4>
          <p className="text-accent text-sm font-medium mb-2">
            {exp.role}
          </p>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {exp.description}
          </p>

          {/* Tech tags */}
          <div className={`flex flex-wrap gap-1.5 ${isLeft ? "justify-end" : "justify-start"}`}>
            {exp.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {exp.technologies.length > 4 && (
              <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                +{exp.technologies.length - 4}
              </span>
            )}
          </div>
          
          {/* Click hint */}
          <p className={`text-xs text-accent/60 mt-3 opacity-0 group-hover:opacity-100 transition-opacity ${isLeft ? "text-right" : "text-left"}`}>
            Click for details →
          </p>
        </div>
      </div>

      {/* Center Node - Stop marker */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-card border-4 border-accent/50 shadow-lg flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-accent" />
        </div>
      </div>

      {/* Spacer for opposite side */}
      <div className="flex-1 max-w-md" />
    </div>
  );
}
