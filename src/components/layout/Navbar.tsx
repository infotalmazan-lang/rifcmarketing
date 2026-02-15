"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Globe, Sparkles } from "lucide-react";

export default function Navbar() {
  const { locale, t, setLocale } = useTranslation();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLandingPage = pathname === "/";
  const isAuditPage = pathname === "/audit";

  const toggleLocale = () => setLocale(locale === "ro" ? "en" : "ro");

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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

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

      <div className="flex items-center gap-3">
        {/* AI Audit link — CTA style */}
        <Link
          href="/audit"
          className={`hidden md:flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2 rounded-sm border transition-all duration-300 no-underline ${
            isAuditPage
              ? "text-rifc-red bg-[rgba(220,38,38,0.1)] border-rifc-red/50"
              : "text-rifc-red/80 border-rifc-red/30 hover:text-rifc-red hover:border-rifc-red/60 hover:bg-[rgba(220,38,38,0.05)]"
          }`}
        >
          <Sparkles size={13} /> AI Audit
        </Link>

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

      {/* Nav links */}
      <div
        className={`${
          menuOpen
            ? "flex flex-col absolute top-[60px] left-0 right-0 bg-[rgba(10,10,15,0.98)] p-5 gap-1 border-b border-[rgba(255,255,255,0.05)]"
            : "hidden"
        } md:flex md:gap-1.5 md:flex-wrap md:justify-end md:max-w-[70%]`}
      >
        {/* Mobile: AI Audit link */}
        <Link
          href="/audit"
          className={`md:hidden font-mono text-[11px] font-normal tracking-[2px] uppercase cursor-pointer px-3 py-2 rounded-sm border transition-all duration-300 whitespace-nowrap no-underline flex items-center gap-2 ${
            isAuditPage
              ? "text-rifc-red bg-[rgba(220,38,38,0.1)] border-rifc-red/50"
              : "text-rifc-red/80 border-rifc-red/30 hover:text-rifc-red hover:border-rifc-red/60"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          <Sparkles size={12} /> AI Audit
        </Link>

        {isLandingPage &&
          t.nav.sections.map((s) => (
            <button
              key={s.id}
              className={`font-body text-[11px] font-normal tracking-[1px] uppercase cursor-pointer px-2.5 py-1.5 rounded-sm border-none bg-transparent transition-all duration-300 whitespace-nowrap ${
                activeSection === s.id
                  ? "text-rifc-red bg-[rgba(220,38,38,0.08)]"
                  : "text-text-faint hover:text-text-secondary"
              }`}
              onClick={() => scrollTo(s.id)}
            >
              {s.label}
            </button>
          ))}
      </div>
    </nav>
  );
}
