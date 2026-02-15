"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { LayoutDashboard, Calculator, Bookmark, Download, LogOut, ArrowLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const SIDEBAR_ITEMS = [
    { href: "/dashboard", label: t.dashboard.overview, icon: LayoutDashboard },
    { href: "/dashboard/calculations", label: t.dashboard.calculations, icon: Calculator },
    { href: "/dashboard/bookmarks", label: t.dashboard.bookmarks, icon: Bookmark },
    { href: "/dashboard/downloads", label: t.dashboard.downloads, icon: Download },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-[220px] border-r border-border-subtle flex flex-col py-6 px-4 flex-shrink-0">
        <Link
          href="/"
          className="font-mono font-semibold text-base tracking-[2px] px-3 mb-8"
        >
          <span className="text-rifc-red">R</span> IF{" "}
          <span className="text-rifc-red">C</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-text-muted hover:text-text-primary hover:bg-surface-card transition-all duration-200"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 pt-4 border-t border-border-subtle">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-text-ghost hover:text-text-primary transition-all duration-200"
          >
            <ArrowLeft size={16} /> {t.dashboard.backToSite}
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-text-ghost hover:text-rifc-red transition-all duration-200 w-full text-left"
            >
              <LogOut size={16} /> {t.dashboard.signOut}
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 md:p-12 overflow-auto">{children}</main>
    </div>
  );
}
