"use client";

import { Download } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function DownloadsPage() {
  const { t } = useTranslation();

  // TODO: Fetch from Supabase when connected
  return (
    <div>
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-3">
        {t.dashboard.historyDownloads}
      </span>
      <h1 className="text-2xl font-light mb-8">
        {t.dashboard.downloadHistoryTitle} <strong className="font-semibold">{t.dashboard.downloadHistoryTitleBold}</strong>
      </h1>

      <div className="text-center py-16 border border-border-subtle border-dashed rounded-sm">
        <Download size={32} className="text-text-ghost mx-auto mb-4" />
        <p className="font-body text-sm text-text-muted mb-4">
          {t.dashboard.noDownloadsYet}
        </p>
        <Link
          href="/resources"
          className="font-mono text-[11px] tracking-[2px] uppercase text-rifc-red hover:underline"
        >
          {t.dashboard.browseResources}
        </Link>
      </div>
    </div>
  );
}
