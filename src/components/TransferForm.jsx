"use client";

import { useState } from "react";
import FrozenNoticeToast, { useFrozenNotice } from "@/components/FrozenNoticeToast";

const CURRENCY_LOCALES = { TRY: "tr-TR", USD: "en-US", GBP: "en-GB", EUR: "de-DE" };
const CURRENCY_SYMBOLS = { TRY: "₺", USD: "$", GBP: "£", EUR: "€" };

function formatMoney(amount, currency = "TRY") {
  const locale = CURRENCY_LOCALES[currency] || "tr-TR";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

const typeLabels = { checking: "Checking", savings: "Savings" };

function SwapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3l4 4-4 4" />
      <path d="M21 7H9" />
      <path d="M7 21l-4-4 4-4" />
      <path d="M3 17h12" />
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

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function TransferForm({ accounts, frozenNotice }) {
  const [step, setStep] = useState("form");
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountName, setToAccountName] = useState("");
  const [toAccountType, setToAccountType] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { notice, showNotice, dismiss } = useFrozenNotice();

  const [pendingTransferId, setPendingTransferId] = useState(null);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  const fromAccount = accounts.find((a) => a.id === fromAccountId);

  async function handleSubmit(e) {
    e.preventDefault();

    setStatus(null);
    setLoading(true);

    const res = await fetch("/api/transfer/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAccountId,
        toAccountName,
        toAccountType,
        toAccountNumber,
        amount,
        description,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStatus({ type: "error", message: data.error || "Transfer failed" });
      return;
    }

    setPendingTransferId(data.pendingTransferId);
    setVerifyError(null);
    setCode("");
    setStep("otp");
  }

  async function handleVerify(e) {
    e.preventDefault();
    setVerifyError(null);
    setVerifying(true);

    const res = await fetch("/api/transfer/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingTransferId, code }),
    });

    const data = await res.json();
    setVerifying(false);

    if (!res.ok) {
      setVerifyError(data.error || "Verification failed");
      return;
    }

    setStatus({
      type: "success",
      message: `Sent ${formatMoney(amount, fromAccount?.currency)} to ${toAccountName || "account ending " + toAccountNumber.slice(-4)}.`,
    });
    setStep("form");
    setFromAccountId("");
    setToAccountName("");
    setToAccountType("");
    setToAccountNumber("");
    setAmount("");
    setDescription("");
    setPendingTransferId(null);
    setCode("");
  }

  function handleBackToForm() {
    setStep("form");
    setVerifyError(null);
  }

  if (step === "otp") {
    return (
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <ShieldIcon className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-text">Verify transfer</h1>
        </div>

        <form onSubmit={handleVerify} className="px-6 py-6">
          <p className="text-sm text-text-secondary">
            We've sent a 6-digit verification code to your email. Enter it below to send{" "}
            <span className="font-semibold text-text">{formatMoney(amount, fromAccount?.currency)}</span> to{" "}
            <span className="font-semibold text-text">{toAccountName || "account ending " + toAccountNumber.slice(-4)}</span>.
          </p>

          {verifyError && (
            <p className="mt-4 text-sm rounded-md px-3 py-2 border text-danger border-danger/30 bg-danger/10">
              {verifyError}
            </p>
          )}

          <label className="block mt-5 text-xs font-bold tracking-wide text-text-secondary uppercase">
            6-digit code
          </label>
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="mt-2 w-full bg-page border border-border rounded-2xl px-4 py-3.5 text-text text-center text-2xl tracking-[0.5em] placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            disabled={verifying || code.length !== 6}
            className="mt-6 w-full bg-primary text-white py-3.5 rounded-full font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            {verifying ? "Verifying…" : "Confirm transfer"}
          </button>

          <button
            type="button"
            onClick={handleBackToForm}
            className="mt-3 w-full text-sm text-text-secondary hover:underline"
          >
            Cancel and edit transfer
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <SwapIcon className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-text">New Transfer</h1>
      </div>

      {status && (
        <div className="mx-6 mt-5">
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
        <label className="block text-xs font-bold tracking-wide text-text-secondary uppercase">From account</label>
        <select
          required
          value={fromAccountId}
          onChange={(e) => setFromAccountId(e.target.value)}
          className="mt-2 w-full bg-page border border-border rounded-2xl px-4 py-3.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="" disabled>
            Select source account
          </option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {typeLabels[acc.type] || acc.type} •••• {acc.accountNumber.slice(-4)} — {formatMoney(acc.balance, acc.currency)}
            </option>
          ))}
        </select>

        <label className="block mt-5 text-xs font-bold tracking-wide text-text-secondary uppercase">
          Recipient account name
        </label>
        <input
          required
          value={toAccountName}
          onChange={(e) => setToAccountName(e.target.value)}
          placeholder="Enter the name on the account"
          className="mt-2 w-full bg-page border border-border rounded-2xl px-4 py-3.5 text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block mt-5 text-xs font-bold tracking-wide text-text-secondary uppercase">
          Recipient account type
        </label>
        <select
          required
          value={toAccountType}
          onChange={(e) => setToAccountType(e.target.value)}
          className="mt-2 w-full bg-page border border-border rounded-2xl px-4 py-3.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="" disabled>
            Select account type
          </option>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
        </select>

        <label className="block mt-5 text-xs font-bold tracking-wide text-text-secondary uppercase">
          To account number
        </label>
        <input
          required
          value={toAccountNumber}
          onChange={(e) => setToAccountNumber(e.target.value)}
          placeholder="Enter recipient account number"
          className="mt-2 w-full bg-page border border-border rounded-2xl px-4 py-3.5 text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block mt-5 text-xs font-bold tracking-wide text-text-secondary uppercase">Amount</label>
        <div className="mt-2 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text font-semibold">
            {CURRENCY_SYMBOLS[fromAccount?.currency] || "₺"}
          </span>
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

        <label className="block mt-5 text-xs font-bold tracking-wide text-text-secondary uppercase">
          Description (optional)
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this transfer for?"
          className="mt-2 w-full bg-page border border-border rounded-2xl px-4 py-3.5 text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-primary text-white py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {loading ? "Sending code…" : "Transfer"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <FrozenNoticeToast notice={notice} onDismiss={dismiss} />
    </div>
  );
}
