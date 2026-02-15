import Link from "next/link";
import { LayoutDashboard, Calculator, Bookmark, Download, LogOut, ArrowLeft } from "lucide-react";

const SIDEBAR_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/calculations", label: "Calculations", icon: Calculator },
  { href: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/dashboard/downloads", label: "Downloads", icon: Download },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <ArrowLeft size={16} /> Back to Site
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-text-ghost hover:text-rifc-red transition-all duration-200 w-full text-left"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 md:p-12 overflow-auto">{children}</main>
    </div>
  );
}
