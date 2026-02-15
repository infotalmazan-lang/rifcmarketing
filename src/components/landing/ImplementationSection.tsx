"use client";

import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock } from "@/components/ui/V2Elements";

export default function ImplementationSection() {
  const { t } = useTranslation();

  return (
    <section id="implementation" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.implementation.chapter}
        titlePlain={t.implementation.titlePlain}
        titleBold={t.implementation.titleBold}
        description={t.implementation.description}
        watermarkNumber="08"
        watermarkColor="#DC2626"
      />

      <div className="space-y-4 my-8">
        {t.implementation.checks.map((item) => (
          <GradientBorderBlock
            key={item.mark}
            gradientFrom="#DC2626"
            gradientTo="#D97706"
            bgTint="transparent"
          >
            <div className="flex gap-4 items-start">
              <span className="text-rifc-red font-mono text-sm flex-shrink-0 mt-0.5">
                {item.mark}
              </span>
              <div className="font-body text-[15px] text-text-muted">
                <strong className="text-text-primary font-medium">
                  {item.title}
                </strong>{" "}
                {item.desc}
              </div>
            </div>
          </GradientBorderBlock>
        ))}
      </div>
    </section>
  );
}
