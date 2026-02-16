"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  BarChart3,
  MessageSquare,
  Mail,
  Download,
  Search,
  Users,
  LogOut,
  ArrowLeft,
  Shield,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/content", label: "Continut", icon: Layers },
  { href: "/admin/case-studies", label: "Case Studies", icon: BarChart3 },
  { href: "/admin/consulting", label: "Consultanta", icon: MessageSquare },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/resources", label: "Resurse", icon: Download },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/users", label: "Utilizatori", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (item: (typeof SIDEBAR_ITEMS)[number]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-[220px] border-r border-border-subtle flex flex-col py-6 px-4 flex-shrink-0">
      <Link
        href="/admin"
        className="flex items-center gap-2 px-3 mb-8"
      >
        <span className="font-mono font-semibold text-base tracking-[2px]">
          <span className="text-rifc-red">R</span> IF{" "}
          <span className="text-rifc-red">C</span>
        </span>
        <Shield size={14} className="text-rifc-red" />
      </Link>

      <nav className="flex-1 space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm transition-all duration-200 ${
              isActive(item)
                ? "text-text-primary bg-surface-card"
                : "text-text-muted hover:text-text-primary hover:bg-surface-card"
            }`}
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
          <ArrowLeft size={16} /> Inapoi la site
        </Link>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-text-ghost hover:text-rifc-red transition-all duration-200 w-full text-left"
          >
            <LogOut size={16} /> Deconectare
          </button>
        </form>
      </div>
    </aside>
  );
}
