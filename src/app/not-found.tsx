import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-[120px] font-light text-[rgba(220,38,38,0.2)] leading-none">
        404
      </div>
      <h1 className="text-2xl font-light mt-4 mb-2">Page Not Found</h1>
      <p className="font-body text-text-muted mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="font-mono text-xs tracking-[3px] uppercase px-8 py-3 border border-[rgba(220,38,38,0.5)] text-rifc-red rounded-sm transition-all duration-300 hover:bg-[rgba(220,38,38,0.1)]"
      >
        Back to Home
      </Link>
    </div>
  );
}
