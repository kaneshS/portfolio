import { Hero } from "@/components/sections/hero";
import { AskBox } from "@/components/sections/ask-box";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <AskBox />
      <Projects />
      <Experience />
      <Stack />
      <Contact />
      <Footer />
    </>
  );
}
