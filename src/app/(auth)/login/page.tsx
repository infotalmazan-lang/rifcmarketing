"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, ArrowRight, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="block text-center mb-10">
          <span className="font-mono font-semibold text-lg tracking-[2px]">
            <span className="text-rifc-red">R</span> IF{" "}
            <span className="text-rifc-red">C</span>
          </span>
        </Link>

        <h1 className="text-2xl font-light text-center mb-2">Welcome back</h1>
        <p className="font-body text-sm text-text-muted text-center mb-8">
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 border border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.05)] rounded-sm text-sm text-rifc-red font-body">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <div>
            <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-ghost" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-card border border-border-light rounded-sm pl-10 pr-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-ghost" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-card border border-border-light rounded-sm pl-10 pr-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                placeholder="Your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 font-mono text-xs tracking-[3px] uppercase px-6 py-4 bg-rifc-red text-surface-bg border border-rifc-red rounded-sm transition-all duration-300 hover:bg-rifc-red-light disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"} <ArrowRight size={14} />
          </button>
        </form>

        <p className="font-body text-sm text-text-muted text-center mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-rifc-red hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
