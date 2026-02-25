"use client";

import { useState, useEffect } from "react";
import { X, ClipboardList } from "lucide-react";

const SURVEY_URL = "https://www.rifcmarketing.com/articolstiintific/sondaj/wizard?tag=site-rifcmarketing";
const DISMISS_KEY = "rifc-survey-banner-dismissed";

/**
 * Fixed bottom banner — invites visitors to take the R IF C survey.
 * Appears after 3s scroll, dismissable (remembered in sessionStorage).
 */
export default function SurveyBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if dismissed this session
    if (sessionStorage.getItem(DISMISS_KEY)) {
      setDismissed(true);
      return;
    }

    // Show after 3 seconds
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] animate-slideUp"
      style={{
        background: "linear-gradient(135deg, rgba(15,15,20,0.97) 0%, rgba(25,15,15,0.97) 100%)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(220,38,38,0.25)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center gap-3 md:gap-5">
        {/* Icon */}
        <div
          className="hidden sm:flex items-center justify-center shrink-0 w-10 h-10 rounded-sm"
          style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)" }}
        >
          <ClipboardList size={18} className="text-rifc-red" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] md:text-[11px] tracking-[2px] uppercase text-rifc-red/80 mb-0.5">
            Sondaj R IF C
          </div>
          <p className="font-body text-[12px] md:text-[13px] text-text-secondary leading-[1.4] truncate md:whitespace-normal">
            Participati la studiul stiintific — evaluati mesaje reale de marketing in 5 minute.
          </p>
        </div>

        {/* CTA Button */}
        <a
          href={SURVEY_URL}
          className="shrink-0 inline-flex items-center gap-2 font-mono text-[10px] md:text-[11px] tracking-[2px] uppercase px-4 md:px-5 py-2.5 rounded-sm border no-underline transition-all duration-300 text-white bg-rifc-red/90 border-rifc-red hover:bg-rifc-red"
        >
          <ClipboardList size={13} className="hidden md:block" />
          Participa
        </a>

        {/* Close */}
        <button
          onClick={dismiss}
          className="shrink-0 p-1.5 rounded-sm text-text-faint hover:text-text-secondary transition-colors border-none bg-transparent cursor-pointer"
          aria-label="Inchide"
        >
          <X size={16} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}} />
    </div>
  );
}
