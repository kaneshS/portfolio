import { Hero } from "@/components/sections/hero";
import { Now } from "@/components/sections/now";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { AICta } from "@/components/sections/ai-cta";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Now />
      <Projects />
      <Experience />
      <Skills />
      <AICta />
      <Contact />
      <Footer />
    </>
  );
}
