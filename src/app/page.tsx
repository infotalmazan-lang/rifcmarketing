"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import PhilosophySection from "@/components/landing/PhilosophySection";
import EquationSection from "@/components/landing/EquationSection";
import AnatomySection from "@/components/landing/AnatomySection";
import MethodologySection from "@/components/landing/MethodologySection";
import RelevanceGateSection from "@/components/landing/RelevanceGateSection";
import OmnichannelSection from "@/components/landing/OmnichannelSection";
import ArchetypesSection from "@/components/landing/ArchetypesSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import ImplementationSection from "@/components/landing/ImplementationSection";
import CaseStudiesSection from "@/components/landing/CaseStudiesSection";
import AIPromptsSection from "@/components/landing/AIPromptsSection";
import AuthorSection from "@/components/landing/AuthorSection";
import { fbTrack } from "@/components/FacebookPixel";

export default function HomePage() {
  // Fire ViewContent on landing page load (once)
  useEffect(() => {
    fbTrack("ViewContent", { content_name: "RIFC Landing Page", content_category: "landing" });
  }, []);
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PhilosophySection />
        <EquationSection />
        <AnatomySection />
        <MethodologySection />
        <RelevanceGateSection />
        <OmnichannelSection />
        <ArchetypesSection />
        <ComparisonSection />
        <ImplementationSection />
        <CaseStudiesSection />
        <AIPromptsSection />
        <AuthorSection />
      </main>
      <Footer />
    </>
  );
}
