import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { ExperienceLedger } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { AICta } from "@/components/sections/ai-cta";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <ExperienceLedger />
      <Skills />
      <AICta />
      <Contact />
      <Footer />
    </>
  );
}
