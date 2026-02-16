"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslation } from "@/lib/i18n";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock, StampBadge } from "@/components/ui/V2Elements";
import { FileText, BarChart3, ClipboardList, BookOpen, Download, Loader2 } from "lucide-react";

const ICONS = [
  <FileText key="ft" size={32} />,
  <BarChart3 key="bc" size={32} />,
  <ClipboardList key="cl" size={32} />,
  <BookOpen key="bo" size={32} />,
];

export default function ResourcesPage() {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = useCallback(() => {
    setDownloading(true);
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.src = "/whitepaper?print=1";
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();
        } catch {
          window.open("/whitepaper", "_blank");
        }
        setDownloading(false);
      }, 800);
    };
  }, []);

  const STATUS_MAP: Record<string, { text: string; color: string; canDownload: boolean }> = {
    available: { text: t.resourcesPage.download, color: "#059669", canDownload: true },
    coming_soon: { text: t.resourcesPage.comingSoon, color: "rgba(220,38,38,0.5)", canDownload: false },
    in_development: { text: t.resourcesPage.inDevelopment, color: "rgba(220,38,38,0.5)", canDownload: false },
  };

  return (
    <>
      <Navbar />
      <iframe ref={iframeRef} style={{ display: "none" }} title="whitepaper-print" />
      <main className="pt-[120px] pb-[80px] px-6 md:px-10 max-w-content mx-auto">
        <SectionHeader
          chapter={t.resourcesPage.chapter}
          titleBold={t.resourcesPage.titleBold}
          description={t.resourcesPage.description}
          watermarkNumber="R"
          watermarkColor="#DC2626"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.resourcesPage.resources.map((r, i) => {
            const statusInfo = STATUS_MAP[r.status];
            return (
              <GradientBorderBlock
                key={r.title}
                gradientFrom={statusInfo.canDownload ? "#059669" : "#DC2626"}
                gradientTo={statusInfo.canDownload ? "#2563EB" : "#D97706"}
              >
                <div className="p-8">
                  <div className="text-text-muted mb-5">{ICONS[i]}</div>
                  <h2 className="font-mono text-base font-semibold tracking-[1px] mb-3">
                    {r.title}
                  </h2>
                  <p className="font-body text-sm leading-[1.7] text-text-muted mb-6">
                    {r.desc}
                  </p>
                  {statusInfo.canDownload ? (
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-6 py-3 bg-rifc-green text-surface-bg border border-rifc-green rounded-sm transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                    >
                      {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      {downloading ? "Se pregătește..." : statusInfo.text}
                    </button>
                  ) : (
                    <StampBadge text={statusInfo.text} color={statusInfo.color} />
                  )}
                </div>
              </GradientBorderBlock>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
