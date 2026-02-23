import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Freelance } from "@/components/sections/freelance";
import { Skills } from "@/components/sections/skills";
import { AICta } from "@/components/sections/ai-cta";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Freelance />
      <Skills />
      <AICta />
      <Contact />
      <Footer />
    </>
  );
}
