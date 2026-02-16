"use client";

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
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
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
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
