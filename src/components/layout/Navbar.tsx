"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Globe, ChevronDown, FileText, ExternalLink } from "lucide-react";

export default function Navbar() {
  const { locale, t, setLocale } = useTranslation();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLandingPage = pathname === "/";
  const isWhitepaperPage = pathname === "/whitepaper" || pathname === "/resources";

  /* ─── 3-way language toggle: RO → EN → RU → RO ─── */
  const toggleLocale = () => {
    const order: Record<string, "ro" | "en" | "ru"> = { ro: "en", en: "ru", ru: "ro" };
    setLocale(order[locale] ?? "ro");
  };

  /* ─── scroll tracking + intersection observer ─── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (!isLandingPage) {
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-80px 0px -40% 0px" }
    );

    document.querySelectorAll("section[id]").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isLandingPage]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, []);

  /* ─── check if a group contains the active section ─── */
  const isGroupActive = useCallback(
    (section: (typeof t.nav.sections)[number]) => {
      if (section.submenu) {
        return section.submenu.some((sub) => sub.id === activeSection);
      }
      return activeSection === section.id;
    },
    [activeSection]
  );

  /* ─── desktop hover handlers with delay ─── */
  const handleMouseEnter = useCallback((id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-4 flex justify-between items-center transition-all duration-400 ${
        scrolled || !isLandingPage
          ? "bg-[rgba(10,10,15,0.95)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.05)]"
          : ""
      }`}
    >
      <Link
        href="/"
        className="font-mono font-semibold text-lg tracking-[2px] cursor-pointer no-underline text-text-primary"
      >
        <span className="text-rifc-red">R</span> IF{" "}
        <span className="text-rifc-red">C</span>
      </Link>

      {/* ─── CTA LINKS (center-left) ─── */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          href="/whitepaper"
          className={`flex items-center gap-1.5 font-mono text-[11px] tracking-[2px] uppercase px-3 py-1.5 rounded-sm transition-all duration-200 no-underline ${
            isWhitepaperPage
              ? "text-text-primary"
              : "text-text-faint hover:text-text-secondary"
          }`}
        >
          <FileText size={12} /> White Paper
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* RIFC.AI external link — CTA style */}
        <a
          href="https://rifc.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2 rounded-sm border transition-all duration-300 no-underline text-rifc-red/80 border-rifc-red/30 hover:text-rifc-red hover:border-rifc-red/60 hover:bg-[rgba(220,38,38,0.05)]"
        >
          <ExternalLink size={13} /> RIFC.AI
        </a>

        {/* Language toggle */}
        <button
          onClick={toggleLocale}
          className="font-mono text-[11px] tracking-[2px] text-text-faint hover:text-text-secondary transition-colors flex items-center gap-1.5"
        >
          <Globe size={14} /> {t.nav.langSwitch}
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden border border-[rgba(255,255,255,0.1)] text-text-primary p-2 rounded-sm"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ─── DESKTOP NAV ─── */}
      <div className="hidden md:flex md:gap-1 md:items-center md:justify-end">
        {isLandingPage &&
          t.nav.sections.map((s) =>
            s.submenu ? (
              /* group with dropdown */
              <div
                key={s.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(s.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`font-body text-[11px] font-normal tracking-[1px] uppercase cursor-pointer px-2.5 py-1.5 rounded-sm border-none bg-transparent transition-all duration-200 whitespace-nowrap flex items-center gap-1 ${
                    isGroupActive(s)
                      ? "text-rifc-red bg-[rgba(220,38,38,0.08)]"
                      : "text-text-faint hover:text-text-secondary"
                  }`}
                  onClick={() => scrollTo(s.submenu![0].id)}
                >
                  {s.label}
                  <ChevronDown
                    size={10}
                    className={`transition-transform duration-200 ${
                      openDropdown === s.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* dropdown panel */}
                <div
                  className={`absolute top-full left-0 mt-1.5 min-w-[200px] py-2 rounded-sm border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.98)] backdrop-blur-[20px] transition-all duration-150 ${
                    openDropdown === s.id
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  }`}
                >
                  {s.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => scrollTo(sub.id)}
                      className={`w-full text-left font-body text-[11px] tracking-[0.5px] px-4 py-2 transition-all duration-150 ${
                        activeSection === sub.id
                          ? "text-rifc-red bg-[rgba(220,38,38,0.08)]"
                          : "text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.03)]"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* single item (no dropdown) */
              <button
                key={s.id}
                className={`font-body text-[11px] font-normal tracking-[1px] uppercase cursor-pointer px-2.5 py-1.5 rounded-sm border-none bg-transparent transition-all duration-200 whitespace-nowrap ${
                  isGroupActive(s)
                    ? "text-rifc-red bg-[rgba(220,38,38,0.08)]"
                    : "text-text-faint hover:text-text-secondary"
                }`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            )
          )}
      </div>

      {/* ─── MOBILE NAV ─── */}
      <div
        className={`${
          menuOpen
            ? "flex flex-col absolute top-[60px] left-0 right-0 bg-[rgba(10,10,15,0.98)] backdrop-blur-[20px] p-5 gap-0.5 border-b border-[rgba(255,255,255,0.05)]"
            : "hidden"
        } md:hidden`}
      >
        {/* Mobile: Page links */}
        <Link
          href="/whitepaper"
          className={`font-mono text-[11px] font-normal tracking-[2px] uppercase cursor-pointer px-3 py-2.5 rounded-sm whitespace-nowrap no-underline flex items-center gap-2 ${
            isWhitepaperPage ? "text-text-primary" : "text-text-faint"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          <FileText size={12} /> White Paper
        </Link>
        <a
          href="https://rifc.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] font-normal tracking-[2px] uppercase cursor-pointer px-3 py-2.5 rounded-sm border transition-all duration-300 whitespace-nowrap no-underline flex items-center gap-2 mb-2 text-rifc-red/80 border-rifc-red/30 hover:text-rifc-red hover:border-rifc-red/60"
          onClick={() => setMenuOpen(false)}
        >
          <ExternalLink size={12} /> RIFC.AI
        </a>

        {isLandingPage &&
          t.nav.sections.map((s) =>
            s.submenu ? (
              /* mobile accordion group */
              <div key={s.id}>
                <button
                  onClick={() =>
                    setMobileExpanded(mobileExpanded === s.id ? null : s.id)
                  }
                  className={`w-full text-left font-body text-[12px] font-normal tracking-[1px] uppercase cursor-pointer px-3 py-2.5 rounded-sm border-none bg-transparent transition-all duration-200 whitespace-nowrap flex items-center justify-between ${
                    isGroupActive(s)
                      ? "text-rifc-red"
                      : "text-text-faint"
                  }`}
                >
                  {s.label}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      mobileExpanded === s.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* accordion children */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    mobileExpanded === s.id ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {s.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => scrollTo(sub.id)}
                      className={`w-full text-left font-body text-[11px] tracking-[0.5px] pl-7 pr-3 py-2 transition-all duration-150 ${
                        activeSection === sub.id
                          ? "text-rifc-red bg-[rgba(220,38,38,0.06)]"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* mobile single item */
              <button
                key={s.id}
                className={`w-full text-left font-body text-[12px] font-normal tracking-[1px] uppercase cursor-pointer px-3 py-2.5 rounded-sm border-none bg-transparent transition-all duration-200 whitespace-nowrap ${
                  isGroupActive(s)
                    ? "text-rifc-red"
                    : "text-text-faint"
                }`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            )
          )}
      </div>
    </nav>
  );
}
