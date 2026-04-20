import { HeroSection } from "@/app/_home/HeroSection";
import { StatsSection } from "@/app/_home/StatsSection";
import { SkillsSection } from "@/app/_home/SkillsSection";
import { AboutSection } from "@/app/_home/AboutSection";
import { ContactSection } from "@/app/_home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}