"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, ArrowRight, Layers } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { projects, type Project } from "@/data/profile";
import { Mermaid } from "@/components/ui/mermaid";
import posthog from "posthog-js";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ProjectCard({
  project,
  onClick,
  index,
}: {
  project: Project;
  onClick: () => void;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
          <Layers className="w-6 h-6 text-accent" />
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Key Metrics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.metrics.slice(0, 2).map((metric) => (
            <span
              key={metric.label}
              className="text-xs px-2 py-1 rounded-full bg-muted"
            >
              <span className="font-medium text-accent">{metric.value}</span>{" "}
              <span className="text-muted-foreground">{metric.label}</span>
            </span>
          ))}
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge className="text-xs">
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-5 h-5 text-accent" />
        </div>
      </div>
    </div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Layers className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-xl bg-muted/50 text-center"
              >
                <div className="text-2xl font-bold text-accent mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Problem */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">The Challenge</h3>
            <p className="text-muted-foreground">{project.problem}</p>
          </div>

          {/* Architecture */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Architecture</h3>
            {project.architectureDiagram ? (
              <Mermaid chart={project.architectureDiagram} />
            ) : (
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  {project.architecture}
                </p>
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech}>
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          {(project.link || project.github) && (
            <div className="flex gap-4">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Project
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    posthog.capture("project_modal_opened", {
      project_id: project.id,
      project_title: project.title,
    });
    setSelectedProject(project);
  };

  return (
    <Section id="projects">
      <SectionHeader
        title="Featured Projects"
        subtitle="Systems I've built that solve real-world problems at scale"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
