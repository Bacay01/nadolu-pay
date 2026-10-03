"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import NimbusLogo from "@/components/NimbusLogo";

export default function LoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCredentialsSubmit(e) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.target);
    setEmail(formData.get("email"));
    setPassword(formData.get("password"));
    setStage("pin");
  }

  async function handlePinSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const res = await signIn("credentials", {
      email,
      password,
      pin: formData.get("pin"),
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email, password, or PIN");
      setStage("credentials");
      return;
    }

    router.push("/dashboard");
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
          Build a stronger financial future with Chase.
        </p>
      </div>

      <div className="w-full md:max-w-md md:mx-auto md:pb-16">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl px-6 py-8 md:px-8">
          <h1 className="text-2xl font-bold text-navy">Log in to Chase</h1>
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          {stage === "credentials" && (
            <form onSubmit={handleCredentialsSubmit} className="mt-6">
              <label className="block mb-2 text-sm font-medium text-text">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={email}
                className="w-full mb-4 px-3 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <label className="block mb-2 text-sm font-medium text-text">Password</label>
              <div className="mb-2">
                <PasswordInput name="password" required />
              </div>

              <div className="mb-4 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-text">
                  <input type="checkbox" className="rounded border-border" />
                  Remember me
                </label>
                <label className="flex items-center gap-2 text-text">
                  <input type="checkbox" className="rounded border-border" />
                  Use token
                </label>
              </div>

              <p className="mb-6 text-right text-sm">
                <Link href="/forgot-password" className="text-primary hover:text-primary-dark underline">
                  Forgot password?
                </Link>
              </p>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
              >
                Continue
              </button>
            </form>
          )}

          {stage === "pin" && (
            <form onSubmit={handlePinSubmit} className="mt-6">
              <p className="mb-4 text-sm text-text-secondary">Enter your 4-digit login PIN</p>
              <div className="mb-6">
                <PasswordInput name="pin" required minLength={4} placeholder="e.g. 1234" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              <button
                type="button"
                onClick={() => setStage("credentials")}
                className="w-full mt-3 text-sm text-text-secondary hover:text-text underline"
              >
                Back
              </button>
            </form>
          )}

          <p className="mt-5 text-sm text-center text-text">
            No account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary-dark underline">
              Sign up
            </Link>
          </p>

          <p className="mt-3 text-xs text-center text-text-secondary">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}