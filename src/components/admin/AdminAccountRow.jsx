"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminTransactionHistory from "./AdminTransactionHistory";

const CURRENCY_LOCALES = { TRY: "tr-TR", USD: "en-US", GBP: "en-GB", EUR: "de-DE" };
const CURRENCY_SYMBOLS = { TRY: "₺", USD: "$", GBP: "£", EUR: "€" };
const CURRENCIES = ["TRY", "USD", "GBP", "EUR"];

function formatMoney(amount, currency = "TRY") {
  const locale = CURRENCY_LOCALES[currency] || "tr-TR";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

const typeLabels = { checking: "Checking", savings: "Savings" };
const DEFAULT_FROZEN_MESSAGE = "This account has been frozen. Please contact support.";

export default function AdminAccountRow({ account }) {
  const router = useRouter();
  const [balance, setBalance] = useState(account.balance.toString());
  const [currency, setCurrency] = useState(account.currency || "TRY");
  const [reason, setReason] = useState(account.frozenReason || "");
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [freezing, setFreezing] = useState(false);
  const [savingReason, setSavingReason] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setBalance(account.balance.toString());
    setCurrency(account.currency || "TRY");
  }, [account.balance, account.currency]);

  async function patch(body) {
    const res = await fetch(`/api/admin/accounts/${account.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");
    return data;
  }

  async function handleBalanceSave(e) {
    e.preventDefault();
    setStatus(null);
    setSaving(true);
    try {
      await patch({ balance: Number(balance), currency });
      setStatus({ type: "success", message: "Balance updated." });
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleConvert() {
    setStatus(null);
    setConverting(true);
    try {
      await patch({ currency });
      setStatus({ type: "success", message: `Converted to ${currency}.` });
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setConverting(false);
    }
  }

  async function handleFreeze() {
    setStatus(null);
    setFreezing(true);
    try {
      await patch({ frozen: true, frozenReason: reason.trim() || DEFAULT_FROZEN_MESSAGE });
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setFreezing(false);
    }
  }

  async function handleUnfreeze() {
    setStatus(null);
    setFreezing(true);
    try {
      await patch({ frozen: false, frozenReason: null });
      setReason("");
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setFreezing(false);
    }
  }

  async function handleUpdateReason(e) {
    e.preventDefault();
    setStatus(null);
    setSavingReason(true);
    try {
      await patch({ frozenReason: reason.trim() || DEFAULT_FROZEN_MESSAGE });
      setStatus({ type: "success", message: "Message updated." });
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSavingReason(false);
    }
  }

  const currencyChanged = currency !== (account.currency || "TRY");

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text">
          {typeLabels[account.type] || account.type} •••• {account.accountNumber.slice(-4)}
        </p>
        {account.frozen && <span className="text-xs font-semibold text-danger">FROZEN</span>}
      </div>

      <p className="mt-1 text-xs text-text-secondary">
        Current balance: {formatMoney(account.balance, account.currency || "TRY")}
      </p>

      {status && (
        <p
          className={`mt-2 text-xs rounded px-2 py-1 border ${
            status.type === "success" ? "text-success border-success/30 bg-success/10" : "text-danger border-danger/30 bg-danger/10"
          }`}
        >
          {status.message}
        </p>
      )}

      <form onSubmit={handleBalanceSave} className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-text-secondary text-sm">{CURRENCY_SYMBOLS[currency] || currency}</span>
        <input
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className="w-32 px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="text-sm text-primary font-medium hover:underline disabled:opacity-50"
        >
          {saving ? "Saving…" : "Update balance"}
        </button>
      </form>

      {currencyChanged && (
        <button
          type="button"
          onClick={handleConvert}
          disabled={converting}
          className="mt-2 text-sm text-primary font-medium hover:underline disabled:opacity-50"
        >
          {converting ? "Converting…" : `Convert current balance to ${currency} at today's rate`}
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <label className="block text-xs font-medium text-text-secondary">
          {account.frozen ? "Message shown to customer" : "Freeze message (shown to customer if they try a transaction)"}
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={DEFAULT_FROZEN_MESSAGE}
          rows={2}
          className="mt-1 w-full text-sm px-2 py-1.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />

        <div className="mt-2 flex items-center gap-4">
          {account.frozen ? (
            <>
              <button
                onClick={handleUpdateReason}
                disabled={savingReason}
                className="text-sm text-primary font-medium hover:underline disabled:opacity-50"
              >
                {savingReason ? "Saving…" : "Update message"}
              </button>
              <button
                onClick={handleUnfreeze}
                disabled={freezing}
                className="text-sm font-medium text-success hover:underline disabled:opacity-50"
              >
                {freezing ? "Working…" : "Unfreeze account"}
              </button>
            </>
          ) : (
            <button
              onClick={handleFreeze}
              disabled={freezing}
              className="text-sm font-medium text-danger hover:underline disabled:opacity-50"
            >
              {freezing ? "Working…" : "Freeze account"}
            </button>
          )}
        </div>
      </div>

      <AdminTransactionHistory accountId={account.id} transactions={account.transactions || []} currency={account.currency} />
    </div>
  );
}
