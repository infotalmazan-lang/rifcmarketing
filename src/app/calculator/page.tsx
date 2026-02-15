import type { Metadata } from "next";
import { createMetadata, calculatorJsonLd } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CalculatorForm from "@/components/calculator/CalculatorForm";

export const metadata: Metadata = createMetadata({
  title: "R IF C Calculator — Score Your Marketing Clarity",
  description:
    "Calculate your marketing Clarity score using R + (I × F) = C. Input Relevance, Interest, and Form to get instant diagnosis and actionable recommendations.",
  path: "/calculator",
});

export default function CalculatorPage() {
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

        <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
          Interactive Tool
        </span>
        <h1 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-4">
          R IF C <strong className="font-semibold">Calculator</strong>
        </h1>
        <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-12 font-light">
          Score any marketing message, campaign, or asset. Adjust the three
          variables and get instant diagnostic feedback with actionable
          recommendations.
        </p>

        <CalculatorForm />
      </main>
      <Footer />
    </>
  );
}
