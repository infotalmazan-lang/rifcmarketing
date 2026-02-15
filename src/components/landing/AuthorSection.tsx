"use client";

import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock, StampBadge } from "@/components/ui/V2Elements";

export default function AuthorSection() {
  const { t } = useTranslation();

  return (
    <section id="author" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.author.chapter}
        titlePlain={t.author.name}
        titleBold={t.author.nameBold}
        watermarkNumber="DT"
        watermarkColor="#DC2626"
      />

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-[60px] items-start">
        <div className="w-[120px] h-[120px] border-2 border-border-red-subtle rounded-full flex items-center justify-center text-[48px] font-light text-rifc-red">
          DT
        </div>
        <div>
          <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
            {t.author.bio1}
          </p>
          <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
            {t.author.bio2}
          </p>

          <GradientBorderBlock
            gradientFrom="#DC2626"
            gradientTo="#D97706"
            bgTint="transparent"
          >
            <p className="italic text-xl leading-[1.7] text-text-muted">
              {t.author.quote}
            </p>
          </GradientBorderBlock>

          <div className="flex gap-3 flex-wrap mt-6">
            {t.author.tags.map((tag, idx) => {
              const colors = ["#DC2626", "#2563EB", "#059669"];
              return (
                <StampBadge
                  key={tag}
                  text={tag}
                  color={colors[idx] || colors[0]}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
