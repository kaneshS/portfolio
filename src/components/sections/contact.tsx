"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowUpRight, MessageSquare } from "lucide-react";
import { Section } from "@/components/ui/section";
import { MotionButton } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/data/profile";

export function Contact() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const socialLinks = [
    {
      label: "GitHub",
      href: profile.github,
      icon: Github,
    },
    {
      label: "LinkedIn",
      href: profile.linkedin,
      icon: Linkedin,
    },
    {
      label: "Email",
      href: `mailto:${profile.email}`,
      icon: Mail,
    },
  ];

  return (
    <Section id="contact" className="bg-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            I&apos;m always interested in discussing new projects, complex systems
            challenges, or opportunities to create impact at scale.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <MotionButton 
            size="lg" 
            className="gap-2"
            onClick={() => setIsFormOpen(true)}
          >
            <MessageSquare className="w-4 h-4" />
            Get in Touch
          </MotionButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-6"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <link.icon className="w-5 h-5" />
              <span className="text-sm">{link.label}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </Section>
  );
}
