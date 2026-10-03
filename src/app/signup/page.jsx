"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import NimbusLogo from "@/components/NimbusLogo";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        pin: formData.get("pin"),
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
    <main className="min-h-screen relative flex flex-col">
      <div className="fixed inset-0 -z-10 bg-[url('/backgroundimg.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/10 to-navy/70" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pt-14 pb-8 md:items-center md:text-center md:pt-20">
        <div className="flex items-center gap-2 text-white">
          <span className="font-bold text-3xl tracking-tight">Chase</span>
          <NimbusLogo className="w-8 h-8" />
        </div>
        <p className="mt-3 text-white/90 text-lg max-w-xs md:max-w-sm">
          Open an account in under a minute.
        </p>
      </div>

      <div className="w-full md:max-w-md md:mx-auto md:pb-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl px-6 py-8 md:px-8"
        >
          <h1 className="text-2xl font-bold text-navy">Create your Chase account</h1>
          {error && <p className="mt-3 mb-2 text-sm text-danger">{error}</p>}

          <label className="block mt-6 mb-2 text-sm font-medium text-text">Full name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full mb-4 px-3 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <label className="block mb-2 text-sm font-medium text-text">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full mb-4 px-3 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <label className="block mb-2 text-sm font-medium text-text">Password</label>
          <div className="mb-4">
            <PasswordInput name="password" required minLength={6} />
          </div>

          <label className="block mb-2 text-sm font-medium text-text">4-digit login PIN</label>
          <div className="mb-6">
            <PasswordInput name="pin" required minLength={4} placeholder="e.g. 1234" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          <p className="mt-5 text-sm text-center text-text">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-dark underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}