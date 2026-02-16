import { createServiceRole } from "@/lib/supabase/server";
import {
  FileText,
  MessageSquare,
  Mail,
  Calculator,
  BarChart3,
  Download,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  const supabase = createServiceRole();

  const [
    { count: blogCount },
    { count: consultingCount },
    { count: consultingNewCount },
    { count: newsletterCount },
    { count: calcCount },
    { count: caseStudyCount },
    { count: resourceCount },
    { count: userCount },
    { data: recentConsulting },
    { data: recentSubscribers },
  ] = await Promise.all([
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase
      .from("consulting_requests")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("consulting_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true }),
    supabase.from("calculations").select("*", { count: "exact", head: true }),
    supabase.from("case_studies").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("consulting_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false })
      .limit(5),
  ]);

  return {
    blogCount: blogCount || 0,
    consultingCount: consultingCount || 0,
    consultingNewCount: consultingNewCount || 0,
    newsletterCount: newsletterCount || 0,
    calcCount: calcCount || 0,
    caseStudyCount: caseStudyCount || 0,
    resourceCount: resourceCount || 0,
    userCount: userCount || 0,
    recentConsulting: recentConsulting || [],
    recentSubscribers: recentSubscribers || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Articole Blog",
      value: stats.blogCount,
      icon: FileText,
      href: "/admin/blog",
      color: "text-blue-400",
    },
    {
      label: "Cereri Consultanta",
      value: stats.consultingCount,
      badge: stats.consultingNewCount > 0 ? stats.consultingNewCount : null,
      icon: MessageSquare,
      href: "/admin/consulting",
      color: "text-amber-400",
    },
    {
      label: "Newsletter",
      value: stats.newsletterCount,
      icon: Mail,
      href: "/admin/newsletter",
      color: "text-green-400",
    },
    {
      label: "Calculatii",
      value: stats.calcCount,
      icon: Calculator,
      href: "/admin",
      color: "text-purple-400",
    },
    {
      label: "Case Studies",
      value: stats.caseStudyCount,
      icon: BarChart3,
      href: "/admin/case-studies",
      color: "text-cyan-400",
    },
    {
      label: "Resurse",
      value: stats.resourceCount,
      icon: Download,
      href: "/admin/resources",
      color: "text-pink-400",
    },
    {
      label: "Utilizatori",
      value: stats.userCount,
      icon: Users,
      href: "/admin/users",
      color: "text-indigo-400",
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-light mb-1">Admin Dashboard</h1>
        <p className="font-body text-sm text-text-muted">
          Privire de ansamblu asupra platformei R IF C
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="p-5 border border-border-light rounded-sm hover:border-border-red-subtle transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon
                size={18}
                className={`${card.color} opacity-60 group-hover:opacity-100 transition-opacity`}
              />
              {card.badge && (
                <span className="font-mono text-[10px] tracking-[1px] px-2 py-0.5 bg-rifc-red text-surface-bg rounded-sm">
                  {card.badge} noi
                </span>
              )}
            </div>
            <div className="font-mono text-2xl text-text-primary mb-1">
              {card.value}
            </div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-ghost">
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/admin/blog/new"
          className="font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200"
        >
          + Articol Nou
        </Link>
        <Link
          href="/admin/consulting"
          className="font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-border-light text-text-muted rounded-sm hover:border-border-red-subtle hover:text-text-primary transition-all duration-200"
        >
          Vezi Cereri
        </Link>
        <Link
          href="/admin/case-studies/new"
          className="font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-border-light text-text-muted rounded-sm hover:border-border-red-subtle hover:text-text-primary transition-all duration-200"
        >
          + Case Study
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consulting Requests */}
        <div className="border border-border-light rounded-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-text-ghost" />
            <h2 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost">
              Ultime Cereri Consultanta
            </h2>
          </div>
          {stats.recentConsulting.length === 0 ? (
            <p className="font-body text-sm text-text-ghost">
              Nicio cerere inca.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentConsulting.map((req: Record<string, string>) => (
                <Link
                  key={req.id}
                  href={`/admin/consulting/${req.id}`}
                  className="flex items-center justify-between p-3 border border-border-subtle rounded-sm hover:border-border-light transition-all duration-200"
                >
                  <div>
                    <div className="font-body text-sm text-text-primary">
                      {req.name}
                    </div>
                    <div className="font-body text-xs text-text-ghost">
                      {req.email}
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border rounded-sm ${
                      req.status === "new"
                        ? "text-rifc-red border-[rgba(220,38,38,0.3)]"
                        : req.status === "contacted"
                          ? "text-amber-400 border-amber-400/30"
                          : "text-text-ghost border-border-subtle"
                    }`}
                  >
                    {req.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Newsletter Subscribers */}
        <div className="border border-border-light rounded-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={14} className="text-text-ghost" />
            <h2 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost">
              Ultimi Subscriberi Newsletter
            </h2>
          </div>
          {stats.recentSubscribers.length === 0 ? (
            <p className="font-body text-sm text-text-ghost">
              Niciun subscriber inca.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentSubscribers.map(
                (sub: Record<string, string | boolean>) => (
                  <div
                    key={sub.id as string}
                    className="flex items-center justify-between p-3 border border-border-subtle rounded-sm"
                  >
                    <div className="font-body text-sm text-text-primary">
                      {sub.email as string}
                    </div>
                    <div className="font-mono text-[10px] text-text-ghost">
                      {new Date(sub.subscribed_at as string).toLocaleDateString(
                        "ro-RO"
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
