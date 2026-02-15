"use client";

import { FileText, BarChart3, ClipboardList, BookOpen } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock, StampBadge } from "@/components/ui/V2Elements";

const ICONS = [
  <FileText key="ft" size={28} />,
  <BarChart3 key="bc" size={28} />,
  <ClipboardList key="cl" size={28} />,
  <BookOpen key="bo" size={28} />,
];

export default function ResourcesSection() {
  const { t } = useTranslation();

  return (
    <section id="resources" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.resourcesSection.chapter}
        titleBold={t.resourcesSection.titleBold}
        description={t.resourcesSection.description}
        watermarkNumber="11"
        watermarkColor="#DC2626"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {t.resourcesSection.resources.map((r, idx) => {
          const statusInfo = t.resourcesSection.statusLabels[r.status];
          return (
            <GradientBorderBlock
              key={r.title}
              gradientFrom={statusInfo.color}
              gradientTo={statusInfo.color}
              bgTint="transparent"
            >
              <div className="text-text-muted mb-4">{ICONS[idx]}</div>
              <div className="font-mono text-sm font-semibold tracking-[1px] mb-3">
                {r.title}
              </div>
              <div className="font-body text-sm leading-[1.7] text-text-muted mb-4">
                {r.desc}
              </div>
              <StampBadge text={statusInfo.text} color={statusInfo.color} />
            </GradientBorderBlock>
          );
        })}
      </div>
    </section>
  );
}
