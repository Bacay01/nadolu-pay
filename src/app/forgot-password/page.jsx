"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-page">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface p-8 rounded-lg shadow border border-border">
        <h1 className="text-2xl font-bold mb-2 text-navy">Reset your password</h1>
        <p className="mb-6 text-sm text-text-secondary">
          This is a simplified demo flow — no email is actually sent. Enter your account email to continue.
        </p>
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        <label className="block mb-2 text-sm font-medium text-text">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full mb-6 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    </main>
  );
}