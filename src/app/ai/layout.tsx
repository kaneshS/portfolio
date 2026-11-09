import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask the assistant | Kaneshwar Sharma",
  description: "Ask questions about Kaneshwar Sharma's experience, projects and stack. Answers come from his resume only.",
};

export default function AILayout({ children }: { children: React.ReactNode }) {
  return children;
}
