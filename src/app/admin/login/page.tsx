"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
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

        {/* Form */}
        <div className="bg-[#3a3a3a] rounded-xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Sign In</h2>
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
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8C8277] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2C2C2C] border border-[#4a4a4a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8C8277] mt-4">
          For access issues, contact your web administrator.
        </p>
      </div>
    </div>
  );
}
