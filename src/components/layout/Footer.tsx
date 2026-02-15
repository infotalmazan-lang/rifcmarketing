"use client";

import { useTranslation } from "@/lib/i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="text-center py-[60px] px-10 border-t border-border-subtle">
      <div className="font-mono text-[11px] text-text-invisible tracking-[2px]">
        &copy; {new Date().getFullYear()} {t.footer.copyright}
      </div>
      <div className="font-mono text-[10px] text-[rgba(232,230,227,0.1)] mt-3 tracking-[4px]">
        {t.footer.site}
      </div>
    </footer>
  );
}
