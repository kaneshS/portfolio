"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";
import { MotionButton } from "@/components/ui/button";
import Link from "next/link";

const sampleQuestions = [
  "What backend systems have you built?",
  "Tell me about your cloud experience",
  "What scale have you worked at?",
  "What's your tech stack?",
];

export function AICta() {
  return (
    <Section id="ai">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-purple-500/5 to-transparent border border-accent/20 p-8 md:p-12"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-accent">AI Assistant</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Have Questions?
              <br />
              <span className="gradient-text">Ask My AI</span>
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Get instant answers about my experience, projects, and technical skills. 
              The AI assistant uses only my portfolio data - no hallucinations.
            </p>
            
            <Link href="/ai">
              <MotionButton size="lg" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Start Conversation
                <ArrowRight className="w-4 h-4" />
              </MotionButton>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-4">Try asking:</p>
              <div className="space-y-2">
                {sampleQuestions.map((question, idx) => (
                  <motion.div
                    key={question}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <MessageSquare className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-sm">{question}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
