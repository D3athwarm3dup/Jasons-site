"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setTempPassword(data.tempPassword ?? "");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8B5E3C] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl font-[var(--font-heading)]">N</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">
            Norris Decking & Sheds
          </h1>
          <p className="text-[#8C8277] text-sm mt-1">Admin Portal</p>
        </div>

        <div className="bg-[#3a3a3a] rounded-xl p-8">
          {!submitted ? (
            <>
              <h2 className="text-lg font-semibold text-white mb-2">Reset Password</h2>
              <p className="text-[#8C8277] text-sm mb-6">
                Enter your email and we&apos;ll generate a temporary password for you to log in with.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#8C8277] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#2C2C2C] border border-[#4a4a4a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                    placeholder="your@email.com"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  {loading ? "Generating..." : "Generate Temporary Password"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Password Reset</h2>
              </div>

              {tempPassword ? (
                <>
                  <p className="text-[#8C8277] text-sm mb-4">
                    Your temporary password is shown below. Use it to log in, then change your password immediately via the Users page.
                  </p>
                  <div className="bg-[#2C2C2C] border border-[#4a4a4a] rounded-lg px-4 py-3 mb-6">
                    <p className="text-xs text-[#8C8277] mb-1">Temporary Password</p>
                    <p className="text-white font-mono text-lg tracking-widest select-all">{tempPassword}</p>
                  </div>
                  <p className="text-amber-400 text-xs mb-6">
                    ⚠ Write this down — it won&apos;t be shown again.
                  </p>
                </>
              ) : (
                <p className="text-[#8C8277] text-sm mb-6">
                  If that email is registered, a temporary password has been set. Contact your web administrator for assistance.
                </p>
              )}
            </>
          )}

          <Link
            href="/admin/login"
            className="block text-center text-sm text-[#8B5E3C] hover:text-[#6B4226] transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
