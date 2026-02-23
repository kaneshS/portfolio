"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Briefcase, CheckCircle2, Calendar } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { freelanceProjects, type FreelanceProject } from "@/data/profile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function FreelanceCard({
  project,
  onClick,
  index,
}: {
  project: FreelanceProject;
  onClick: () => void;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={cardRef} onClick={onClick} className="group cursor-pointer opacity-0">
      <div className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5">
        {/* Period badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full bg-accent/10 text-accent">
            <Calendar className="w-3 h-3" />
            {project.period}
          </span>
          <span className="text-sm text-muted-foreground">{project.client}</span>
        </div>

        <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
          {project.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Outcome highlight */}
        {project.outcome && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-green-400">{project.outcome}</span>
          </div>
        )}

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline">+{project.technologies.length - 3}</Badge>
          )}
        </div>

        {/* View more hint */}
        <div className="flex items-center gap-2 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          View details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

function FreelanceModal({
  project,
  onClose,
}: {
  project: FreelanceProject;
  onClose: () => void;
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors focus-ring"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm text-muted-foreground">{project.client}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">
                  {project.period}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{project.title}</h2>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Project Overview
            </h4>
            <p className="text-foreground leading-relaxed">{project.description}</p>
          </div>

          {/* Deliverables */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Deliverables
            </h4>
            <ul className="space-y-2">
              {project.deliverables.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Outcome */}
          {project.outcome && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">
                Outcome
              </h4>
              <p className="text-green-300">{project.outcome}</p>
            </div>
          )}

          {/* Technologies */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
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

export function Freelance() {
  const [selectedProject, setSelectedProject] = useState<FreelanceProject | null>(null);

  return (
    <Section id="freelance" className="bg-muted/20">
      <SectionHeader
        title="Freelance Work"
        subtitle="Independent projects delivering value to clients"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freelanceProjects.map((project, idx) => (
          <FreelanceCard
            key={project.id}
            project={project}
            index={idx}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <FreelanceModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
