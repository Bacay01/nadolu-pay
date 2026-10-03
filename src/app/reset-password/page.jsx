"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: formData.get("password"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface p-8 rounded-lg shadow border border-border">
      <h1 className="text-2xl font-bold mb-6 text-navy">Set a new password</h1>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      <label className="block mb-2 text-sm font-medium text-text">Email</label>
      <input
        value={email}
        disabled
        className="w-full mb-4 px-3 py-2 border border-border rounded-md bg-page text-text-secondary"
      />
      <label className="block mb-2 text-sm font-medium text-text">New password</label>
      <div className="mb-6">
        <PasswordInput name="password" required minLength={6} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark disabled:opacity-50 transition-colors"
      >
        {loading ? "Saving..." : "Save New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-page">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}