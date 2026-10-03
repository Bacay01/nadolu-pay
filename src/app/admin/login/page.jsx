"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface p-8 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-lg text-navy">Chase</span>
          <span className="text-xs font-bold uppercase tracking-wide bg-danger text-white px-2 py-0.5 rounded">
            Admin
          </span>
        </div>
        <p className="mb-6 text-sm text-text-secondary">Internal access only.</p>

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <label className="block mb-2 text-sm font-medium text-text">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block mb-2 text-sm font-medium text-text">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white py-2 rounded-md hover:bg-navy/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}