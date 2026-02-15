"use client";

import { useTranslation } from "@/lib/i18n";
import { calculatorJsonLd } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function CalculatorPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <main className="pt-[120px] pb-[80px] px-6 md:px-10 max-w-content mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(calculatorJsonLd()),
          }}
        />

        <SectionHeader
          chapter={t.calculator.chapter}
          titlePlain={t.calculator.titlePlain}
          titleBold={t.calculator.titleBold}
          description={t.calculator.description}
          watermarkNumber="C"
          watermarkColor="#DC2626"
        />

        <CalculatorForm />
      </main>
      <Footer />
    </>
  );
}
