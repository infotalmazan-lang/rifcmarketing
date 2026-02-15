import { Bookmark } from "lucide-react";
import Link from "next/link";

export default function BookmarksPage() {
  // TODO: Fetch from Supabase when connected
  return (
    <div>
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-3">
        Saved
      </span>
      <h1 className="text-2xl font-light mb-8">
        Bookmarked <strong className="font-semibold">Articles</strong>
      </h1>

      <div className="text-center py-16 border border-border-subtle border-dashed rounded-sm">
        <Bookmark size={32} className="text-text-ghost mx-auto mb-4" />
        <p className="font-body text-sm text-text-muted mb-4">
          No bookmarked articles yet
        </p>
        <Link
          href="/blog"
          className="font-mono text-[11px] tracking-[2px] uppercase text-rifc-red hover:underline"
        >
          Browse articles
        </Link>
      </div>
    </div>
  );
}
