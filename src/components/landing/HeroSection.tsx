"use client";

import { useTranslation } from "@/lib/i18n";
import { WatermarkNumber } from "@/components/ui/V2Elements";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-10 pt-[120px] pb-20 relative"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(220,38,38,0.06)_0%,transparent_70%)]" />

      {/* Subtle watermark behind equation */}
      <WatermarkNumber
        value="110"
        color="#DC2626"
        size="lg"
        className="top-[30%] left-1/2 -translate-x-1/2"
      />

      <div className="relative z-[2]">
        <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-10 opacity-0 animate-fade-up-delay-1">
          {t.hero.subtitle}
        </span>

        <h1 className="text-[clamp(48px,8vw,120px)] font-light leading-[1.05] tracking-[-2px] mb-[30px] opacity-0 animate-fade-up-delay-2">
          {t.hero.titleLine1}
          <br />
          <em className="italic font-light text-rifc-red">{t.hero.titleLine2}</em>
          <br />
          {t.hero.titleLine3}
        </h1>

        <div className="font-mono text-[clamp(20px,3vw,36px)] font-light tracking-[4px] mb-10 px-8 md:px-12 py-6 border border-border-red-subtle rounded-sm bg-[rgba(220,38,38,0.03)] opacity-0 animate-fade-up-delay-3 inline-block">
          <span className="text-rifc-red font-medium">R</span>{" "}
          <span className="text-text-faint">+</span>{" "}
          <span className="text-text-faint">(</span>
          <span className="text-rifc-red font-medium">I</span>{" "}
          <span className="text-text-faint">&times;</span>{" "}
          <span className="text-rifc-red font-medium">F</span>
          <span className="text-text-faint">)</span>{" "}
          <span className="text-text-faint">=</span>{" "}
          <span className="text-rifc-red font-medium">C</span>
        </div>

        <p className="font-body text-lg font-light text-text-muted max-w-[600px] leading-[1.7] mx-auto opacity-0 animate-fade-up-delay-4">
          {t.hero.description}
        </p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 opacity-0 animate-fade-up-delay-5">
        <span className="block w-px h-[60px] bg-gradient-to-b from-[rgba(220,38,38,0.5)] to-transparent mx-auto animate-pulse" />
      </div>
    </section>
  );
}
