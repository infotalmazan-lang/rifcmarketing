"use client";

import { Calculator, Bookmark, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { WatermarkNumber } from "@/components/ui/V2Elements";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div>
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-3">
        {t.dashboard.label}
      </span>
      <h1 className="text-[clamp(24px,3vw,40px)] font-light leading-[1.2] tracking-[-1px] mb-8">
        {t.dashboard.welcomePlain} <strong className="font-semibold">{t.dashboard.welcomeBold}</strong>
      </h1>

      {/* Quick stats — V2 large numbers + watermark */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: Calculator,
            label: t.dashboard.savedCalculations,
            value: "0",
            href: "/dashboard/calculations",
            color: "#DC2626",
          },
          {
            icon: Bookmark,
            label: t.dashboard.bookmarkedArticles,
            value: "0",
            href: "/dashboard/bookmarks",
            color: "#2563EB",
          },
          {
            icon: Download,
            label: t.dashboard.downloads,
            value: "0",
            href: "/dashboard/downloads",
            color: "#059669",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-surface-card border border-border-light rounded-sm p-6 transition-all duration-300 hover:border-border-red-subtle hover:bg-surface-card-hover relative overflow-hidden"
          >
            <WatermarkNumber
              value={stat.value}
              color={stat.color}
              size="sm"
              className="-top-[10px] -right-[10px]"
            />
            <div className="relative z-[1]">
              <stat.icon
                size={20}
                className="mb-3"
                style={{ color: stat.color }}
              />
              <div className="font-mono text-[44px] font-light leading-none mb-2" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="font-body text-sm text-text-muted flex items-center justify-between">
                {stat.label}
                <ArrowRight
                  size={14}
                  className="text-text-ghost group-hover:text-rifc-red transition-colors"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="font-mono text-[11px] tracking-[3px] uppercase text-text-ghost mb-4">
        {t.dashboard.quickActions}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/calculator"
          className="flex items-center gap-4 bg-surface-card border border-border-light rounded-sm p-5 transition-all duration-300 hover:border-border-red-subtle group"
        >
          <Calculator size={20} className="text-rifc-red" />
          <div>
            <div className="font-medium text-sm mb-1 group-hover:text-rifc-red transition-colors">
              {t.dashboard.newCalculation}
            </div>
            <div className="font-body text-xs text-text-muted">
              {t.dashboard.newCalculationDesc}
            </div>
          </div>
        </Link>
        <Link
          href="/blog"
          className="flex items-center gap-4 bg-surface-card border border-border-light rounded-sm p-5 transition-all duration-300 hover:border-border-red-subtle group"
        >
          <Bookmark size={20} className="text-rifc-blue" />
          <div>
            <div className="font-medium text-sm mb-1 group-hover:text-rifc-red transition-colors">
              {t.dashboard.browseArticles}
            </div>
            <div className="font-body text-xs text-text-muted">
              {t.dashboard.browseArticlesDesc}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
