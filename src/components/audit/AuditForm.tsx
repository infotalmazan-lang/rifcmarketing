"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "@/lib/i18n";
import type { AuditResult } from "@/types";
import AuditResultDisplay from "./AuditResult";
import {
  FileText,
  Globe,
  Youtube,
  ImageIcon,
  FileUp,
  ChevronDown,
  Loader2,
  Sparkles,
  AlertTriangle,
  X,
} from "lucide-react";

type TabType = "text" | "url" | "youtube" | "image" | "pdf";

interface TabDef {
  type: TabType;
  icon: typeof FileText;
  labelKey: "tabText" | "tabUrl" | "tabYoutube" | "tabImage" | "tabPdf";
}

const TABS: TabDef[] = [
  { type: "text", icon: FileText, labelKey: "tabText" },
  { type: "url", icon: Globe, labelKey: "tabUrl" },
  { type: "youtube", icon: Youtube, labelKey: "tabYoutube" },
  { type: "image", icon: ImageIcon, labelKey: "tabImage" },
  { type: "pdf", icon: FileUp, labelKey: "tabPdf" },
];

/* ─── Helpers ─────────────────────────────────────────────── */

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function pdfToImages(
  file: File
): Promise<{ base64: string; mediaType: string }[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: { base64: string; mediaType: string }[] = [];

  for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;
    // Use JPEG with quality 0.7 to reduce payload size
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    images.push({
      base64: dataUrl.split(",")[1],
      mediaType: "image/jpeg",
    });
  }

  return images;
}

/* ─── Component ───────────────────────────────────────────── */

export default function AuditForm() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [youtubeContent, setYoutubeContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [channel, setChannel] = useState("");
  const [channelOpen, setChannelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!channelOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setChannelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [channelOpen]);

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) =>
        prev < t.audit.analyzingMessages.length - 1 ? prev + 1 : prev
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [loading, t.audit.analyzingMessages.length]);

  /* ─── File Handlers ───────────────────────────────────────── */

  const handleImageSelect = useCallback(
    (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        setError(t.audit.errorImageTooLarge);
        return;
      }
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        setError(t.audit.errorImageFormat);
        return;
      }
      setError("");
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [t.audit]
  );

  const handlePdfSelect = useCallback(
    async (file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        setError(t.audit.errorPdfTooLarge);
        return;
      }
      if (file.type !== "application/pdf") {
        setError(t.audit.errorPdfFormat);
        return;
      }
      setError("");
      setPdfFile(file);

      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        if (pdf.numPages > 5) {
          setPdfFile(null);
          setError(t.audit.errorPdfTooManyPages);
          return;
        }
        setPdfPageCount(pdf.numPages);
      } catch {
        setPdfFile(null);
        setError(t.audit.errorPdfFormat);
      }
    },
    [t.audit]
  );

  /* ─── Analyze Handler ─────────────────────────────────────── */

  const handleAnalyze = useCallback(async () => {
    setError("");
    setResult(null);
    setLoadingMsgIndex(0);
    setChannelOpen(false);

    let content = "";
    let images: { base64: string; mediaType: string }[] | undefined;

    if (activeTab === "text") {
      content = textContent.trim();
      if (!content) {
        setError(t.audit.errorEmpty);
        return;
      }
    } else if (activeTab === "url") {
      content = urlContent.trim();
      if (!content) {
        setError(t.audit.errorEmpty);
        return;
      }
      try {
        new URL(content);
      } catch {
        setError(t.audit.errorUrl);
        return;
      }
    } else if (activeTab === "youtube") {
      content = youtubeContent.trim();
      if (!content) {
        setError(t.audit.errorEmpty);
        return;
      }
      const ytPatterns = [/youtube\.com\/watch/, /youtu\.be\//, /youtube\.com\/shorts\//];
      if (!ytPatterns.some((p) => p.test(content))) {
        setError(t.audit.errorYoutube);
        return;
      }
    } else if (activeTab === "image") {
      if (!imageFile) {
        setError(t.audit.errorEmpty);
        return;
      }
      try {
        const base64Full = await fileToBase64(imageFile);
        images = [
          {
            base64: base64Full.split(",")[1],
            mediaType: imageFile.type,
          },
        ];
      } catch {
        setError(t.audit.errorImageFormat);
        return;
      }
    } else if (activeTab === "pdf") {
      if (!pdfFile) {
        setError(t.audit.errorEmpty);
        return;
      }
      try {
        images = await pdfToImages(pdfFile);
        if (!images || images.length === 0) {
          setError(t.audit.errorPdfFormat);
          return;
        }
      } catch {
        setError(t.audit.errorPdfFormat);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          content,
          channel: channel || undefined,
          language: locale,
          ...(images ? { images } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "rate_limit" || data.error === "ai_rate_limit") {
          setError(t.audit.errorRateLimit);
        } else if (data.error === "no_api_key" || data.error === "auth_error") {
          setError(t.audit.errorNoKey);
        } else if (
          data.error === "url_fetch_failed" ||
          data.error === "url_extraction_failed" ||
          data.error === "invalid_url"
        ) {
          setError(t.audit.errorUrl);
        } else if (
          data.error === "invalid_youtube_url" ||
          data.error === "youtube_extraction_failed"
        ) {
          setError(t.audit.errorYoutube);
        } else if (data.error === "youtube_no_transcript") {
          setError(t.audit.errorYoutubeNoTranscript);
        } else if (data.error === "too_many_pages") {
          setError(t.audit.errorPdfTooManyPages);
        } else {
          setError(t.audit.errorGeneric);
        }
        return;
      }

      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setError(t.audit.errorGeneric);
      }
    } catch {
      setError(t.audit.errorGeneric);
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    textContent,
    urlContent,
    youtubeContent,
    imageFile,
    pdfFile,
    channel,
    locale,
    t.audit,
  ]);

  const handleReset = useCallback(() => {
    setResult(null);
    setError("");
    setTextContent("");
    setUrlContent("");
    setYoutubeContent("");
    setImageFile(null);
    setImagePreview(null);
    setPdfFile(null);
    setPdfPageCount(0);
    setChannel("");
  }, []);

  /* ─── Result Display ──────────────────────────────────────── */

  if (result) {
    let analyzedInput = "";
    if (activeTab === "text") analyzedInput = textContent;
    else if (activeTab === "url") analyzedInput = urlContent;
    else if (activeTab === "youtube") analyzedInput = youtubeContent;
    else if (activeTab === "image") analyzedInput = imageFile?.name || "image";
    else if (activeTab === "pdf") analyzedInput = pdfFile?.name || "document.pdf";

    return (
      <AuditResultDisplay
        result={result}
        analyzedInput={analyzedInput}
        inputType={activeTab}
        imagePreview={imagePreview}
        pdfPageCount={pdfPageCount}
        onReset={handleReset}
      />
    );
  }

  /* ─── Render ──────────────────────────────────────────────── */

  return (
    <div className="space-y-8">
      {/* V2 Tab switcher — pill style */}
      <div className="flex gap-2 p-1 bg-[rgba(255,255,255,0.02)] border border-border-light rounded-2xl overflow-x-auto">
        {TABS.map(({ type: tab, icon: Icon, labelKey }) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setError("");
            }}
            className={`flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 rounded-2xl transition-all duration-300 shrink-0 ${
              activeTab === tab
                ? "bg-rifc-red text-white"
                : "text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            <Icon size={14} />
            {t.audit[labelKey]}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="space-y-5">
        {/* Text input */}
        {activeTab === "text" && (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder={t.audit.textPlaceholder}
            className="w-full h-[200px] bg-[rgba(255,255,255,0.03)] border border-border-medium rounded-sm p-5 font-body text-[15px] leading-[1.8] text-text-primary placeholder:text-text-ghost resize-y focus:outline-none focus:border-rifc-red/40 transition-colors"
            disabled={loading}
          />
        )}

        {/* URL input */}
        {activeTab === "url" && (
          <input
            type="text"
            value={urlContent}
            onChange={(e) => setUrlContent(e.target.value)}
            placeholder={t.audit.urlPlaceholder}
            className="w-full bg-[rgba(255,255,255,0.03)] border border-border-medium rounded-sm p-4 font-mono text-[15px] text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-rifc-red/40 transition-colors"
            disabled={loading}
          />
        )}

        {/* YouTube input */}
        {activeTab === "youtube" && (
          <input
            type="text"
            value={youtubeContent}
            onChange={(e) => setYoutubeContent(e.target.value)}
            placeholder={t.audit.youtubePlaceholder}
            className="w-full bg-[rgba(255,255,255,0.03)] border border-border-medium rounded-sm p-4 font-mono text-[15px] text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-rifc-red/40 transition-colors"
            disabled={loading}
          />
        )}

        {/* Image upload */}
        {activeTab === "image" && (
          <div>
            {!imageFile ? (
              <label
                className={`flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-border-medium rounded-sm cursor-pointer transition-all duration-300 hover:border-rifc-red/40 hover:bg-[rgba(220,38,38,0.02)] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-rifc-red/40");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("border-rifc-red/40");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-rifc-red/40");
                  const file = e.dataTransfer.files[0];
                  if (file) handleImageSelect(file);
                }}
              >
                <ImageIcon size={32} className="text-text-ghost mb-3" />
                <span className="font-body text-[14px] text-text-muted text-center px-4">
                  {t.audit.imageDropzone}
                </span>
                <span className="font-mono text-[11px] text-text-muted mt-1">
                  {t.audit.imageDropzoneHint}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageSelect(e.target.files[0]);
                  }}
                  disabled={loading}
                />
              </label>
            ) : (
              <div className="flex items-center gap-4 border border-border-light rounded-sm p-4 bg-surface-card">
                {imagePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-sm border border-border-light"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-body text-[14px] text-text-primary truncate">
                    {imageFile.name}
                  </div>
                  <div className="font-mono text-[11px] text-text-muted">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="p-2 text-text-muted hover:text-rifc-red transition-colors shrink-0"
                  disabled={loading}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PDF upload */}
        {activeTab === "pdf" && (
          <div>
            {!pdfFile ? (
              <label
                className={`flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-border-medium rounded-sm cursor-pointer transition-all duration-300 hover:border-rifc-red/40 hover:bg-[rgba(220,38,38,0.02)] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-rifc-red/40");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("border-rifc-red/40");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-rifc-red/40");
                  const file = e.dataTransfer.files[0];
                  if (file) handlePdfSelect(file);
                }}
              >
                <FileUp size={32} className="text-text-ghost mb-3" />
                <span className="font-body text-[14px] text-text-muted text-center px-4">
                  {t.audit.pdfDropzone}
                </span>
                <span className="font-mono text-[11px] text-text-muted mt-1">
                  {t.audit.pdfDropzoneHint}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handlePdfSelect(e.target.files[0]);
                  }}
                  disabled={loading}
                />
              </label>
            ) : (
              <div className="flex items-center gap-4 border border-border-light rounded-sm p-4 bg-surface-card">
                <FileText size={32} className="text-rifc-red shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-body text-[14px] text-text-primary truncate">
                    {pdfFile.name}
                  </div>
                  <div className="font-mono text-[11px] text-text-muted">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB &middot;{" "}
                    {pdfPageCount} {t.audit.previewPages}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setPdfPageCount(0);
                  }}
                  className="p-2 text-text-muted hover:text-rifc-red transition-colors shrink-0"
                  disabled={loading}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Channel selector */}
        <div className="relative" ref={dropdownRef}>
          <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-faint mb-2">
            {t.audit.channelLabel}
          </label>
          <button
            onClick={() => setChannelOpen(!channelOpen)}
            className="w-full md:w-[320px] flex items-center justify-between bg-[rgba(255,255,255,0.03)] border border-border-medium rounded-sm px-4 py-3 font-body text-[14px] transition-colors hover:border-[rgba(255,255,255,0.12)]"
            disabled={loading}
          >
            <span className={channel ? "text-text-primary" : "text-text-faint"}>
              {channel
                ? t.audit.channels.find((c) => c.value === channel)?.label
                : t.audit.channelPlaceholder}
            </span>
            <ChevronDown
              size={14}
              className={`text-text-muted transition-transform ${channelOpen ? "rotate-180" : ""}`}
            />
          </button>

          {channelOpen && (
            <div className="absolute z-50 mt-1 w-full md:w-[320px] bg-[#1a1a24] border border-[rgba(255,255,255,0.12)] rounded-sm max-h-[280px] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <button
                onClick={() => {
                  setChannel("");
                  setChannelOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 font-body text-[13px] text-text-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-text-primary transition-colors"
              >
                — {t.audit.channelPlaceholder}
              </button>
              {t.audit.channels.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => {
                    setChannel(ch.value);
                    setChannelOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 font-body text-[13px] transition-colors ${
                    channel === ch.value
                      ? "text-rifc-red bg-[rgba(220,38,38,0.08)]"
                      : "text-text-secondary hover:bg-[rgba(255,255,255,0.06)] hover:text-text-primary"
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-3 border border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.06)] rounded-sm p-4">
          <AlertTriangle size={16} className="text-[#ef4444] shrink-0" />
          <span className="font-body text-[14px] text-[#ef4444]">{error}</span>
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="flex items-center gap-3 font-mono text-[13px] tracking-[2px] uppercase px-8 py-4 bg-rifc-red text-white rounded-sm hover:bg-rifc-red/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{t.audit.analyzingMessages[loadingMsgIndex]}</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>{t.audit.analyzeBtn}</span>
          </>
        )}
      </button>

      {/* Loading progress indicator */}
      {loading && (
        <div className="space-y-3">
          <div className="h-1 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-rifc-red rounded-full transition-all duration-[2500ms] ease-linear"
              style={{
                width: `${((loadingMsgIndex + 1) / t.audit.analyzingMessages.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex gap-2">
            {t.audit.analyzingMessages.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx <= loadingMsgIndex ? "bg-rifc-red" : "bg-border-light"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
