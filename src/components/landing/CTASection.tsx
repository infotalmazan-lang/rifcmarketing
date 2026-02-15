"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-[120px] px-6 md:px-10 bg-gradient-to-b from-transparent via-[rgba(220,38,38,0.03)] to-transparent">
      <SectionHeader
        chapter={t.cta.chapter}
        titlePlain={t.cta.titlePlain}
        titleBold={t.cta.titleBold}
        description={t.cta.description}
        watermarkNumber="C"
        watermarkColor="#DC2626"
      />

      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href="/resources"
          className="inline-block font-mono text-xs tracking-[3px] uppercase px-12 py-[18px] bg-rifc-red text-surface-bg border border-rifc-red cursor-pointer transition-all duration-300 rounded-sm hover:bg-rifc-red-light"
        >
          {t.cta.downloadBtn}
        </Link>
        <Link
          href="/consulting"
          className="inline-block font-mono text-xs tracking-[3px] uppercase px-12 py-[18px] border border-[rgba(220,38,38,0.5)] text-rifc-red bg-transparent cursor-pointer transition-all duration-300 rounded-sm hover:bg-[rgba(220,38,38,0.1)] hover:border-rifc-red"
        >
          {t.cta.consultingBtn}
        </Link>
        <Link
          href="/calculator"
          className="inline-block font-mono text-xs tracking-[3px] uppercase px-12 py-[18px] border border-[rgba(220,38,38,0.5)] text-rifc-red bg-transparent cursor-pointer transition-all duration-300 rounded-sm hover:bg-[rgba(220,38,38,0.1)] hover:border-rifc-red"
        >
          {t.cta.calculatorBtn}
        </Link>
      </div>
    </div>
  );
}
