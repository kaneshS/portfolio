"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Cloud,
  Database,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { skills } from "@/data/profile";

const categoryIcons: Record<string, LucideIcon> = {
  "Languages & Frameworks": Code2,
  "Cloud & Infrastructure": Cloud,
  "Databases & Messaging": Database,
  "DevOps & Tools": Settings,
};

const categoryDescriptions: Record<string, string> = {
  "Languages & Frameworks":
    "Building robust APIs with Python (FastAPI, Flask) and Node.js. Full-stack capable with React.js.",
  "Cloud & Infrastructure":
    "Deep experience with AWS and GCP, container orchestration, and infrastructure as code with Terraform.",
  "Databases & Messaging":
    "Designing high-throughput pipelines with Kafka, SQL/NoSQL databases, and vector search with ChromaDB.",
  "DevOps & Tools":
    "CI/CD pipelines, secrets management, load balancing, and production monitoring.",
};

export function Skills() {
  return (
    <Section id="skills" className="bg-muted/30">
      <SectionHeader
        title="Skills & Expertise"
        subtitle="Core competencies in backend and infrastructure engineering"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skill, idx) => {
          const Icon = categoryIcons[skill.category] || Code2;

          return (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                    {skill.category}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {categoryDescriptions[skill.category]}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {skill.items.map((item, itemIdx) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: idx * 0.1 + itemIdx * 0.03 }}
                    className="px-3 py-1.5 text-sm rounded-lg bg-muted border border-border hover:border-accent/30 hover:bg-accent/5 transition-colors cursor-default"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Architecture principles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 p-8 rounded-2xl bg-accent/5 border border-accent/20"
      >
        <h3 className="text-xl font-semibold mb-4">Engineering Philosophy</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Event-Driven First",
              description:
                "Prefer decoupled, event-driven architectures with Kafka and message queues for scalability.",
            },
            {
              title: "Cost-Performance Balance",
              description:
                "Optimize for both speed and cost - achieved 50% faster response with 40% cost reduction.",
            },
            {
              title: "Infrastructure as Code",
              description:
                "Terraform for reproducible infrastructure, GitOps for deployment consistency.",
            },
          ].map((principle) => (
            <div key={principle.title}>
              <h4 className="font-medium text-accent mb-2">{principle.title}</h4>
              <p className="text-sm text-muted-foreground">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
