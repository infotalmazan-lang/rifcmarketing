"use client";

import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock } from "@/components/ui/V2Elements";

export default function PhilosophySection() {
  const { t } = useTranslation();

  return (
    <section id="philosophy" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.philosophy.chapter}
        titlePlain={t.philosophy.titlePlain}
        titleBold={t.philosophy.titleBold}
        description={t.philosophy.description}
        watermarkNumber="01"
        watermarkColor="#DC2626"
      />
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light -mt-4">
        <strong className="text-text-primary font-medium">
          {t.philosophy.descriptionBold}
        </strong>
        .
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {t.philosophy.cards.map((card) => (
          <GradientBorderBlock
            key={card.title}
            gradientFrom={card.color}
            gradientTo={card.color}
            bgTint="transparent"
          >
            <div
              className="font-mono text-sm font-semibold tracking-[1px] mb-3"
              style={{ color: card.color }}
            >
              {card.title}
            </div>
            <div className="font-body text-sm leading-[1.7] text-text-muted">
              {card.desc}
            </div>
          </GradientBorderBlock>
        ))}
      </div>
    </section>
  );
}
