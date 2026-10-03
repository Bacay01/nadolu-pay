"use client";

import { useState } from "react";

const typeLabels = { checking: "Checking", savings: "Savings" };

function CardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function ArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function DepositByCardForm({ accounts }) {
  const [toAccountId, setToAccountId] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toAccountId, cardLast4, amount }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStatus({ type: "error", message: data.error || "Deposit failed" });
      return;
    }

    setStatus({ type: "success", message: `Deposited $${amount} — funds available immediately.` });
    setCardLast4("");
    setAmount("");
  }

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <CardIcon className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-text">Deposit by Card</h1>
      </div>

      <p className="px-6 pt-4 text-xs text-text-secondary">
        Demo only — no real card is charged or stored. Enter any 4 digits to simulate a deposit.
      </p>

      {status && (
        <div className="mx-6 mt-4">
          <p
            className={`text-sm rounded-md px-3 py-2 border ${
              status.type === "success"
                ? "text-success border-success/30 bg-success/10"
                : "text-danger border-danger/30 bg-danger/10"
            }`}
          >
            {status.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-6 py-6">
        <label className="block text-xs font-bold tracking-wide text-text-secondary uppercase">Deposit to</label>
        <select
          required
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
          className="mt-2 w-full bg-page border border-border rounded-2xl px-4 py-3.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="" disabled>
            Select destination account
          </option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {typeLabels[acc.type] || acc.type} •••• {acc.accountNumber.slice(-4)}
            </option>
          ))}
        </select>

        <label className="block mt-5 text-xs font-bold tracking-wide text-text-secondary uppercase">
          Card ending in
        </label>
        <input
          required
          value={cardLast4}
          onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="1234"
          inputMode="numeric"
          maxLength={4}
          className="mt-2 w-full bg-page border border-border rounded-2xl px-4 py-3.5 text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block mt-5 text-xs font-bold tracking-wide text-text-secondary uppercase">Amount</label>
        <div className="mt-2 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text font-semibold">$</span>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-page border border-border rounded-2xl pl-8 pr-4 py-3.5 text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-primary text-white py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {loading ? "Depositing…" : "Deposit"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}