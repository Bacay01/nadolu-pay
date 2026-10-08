"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CURRENCY_LOCALES = { TRY: "tr-TR", USD: "en-US", GBP: "en-GB", EUR: "de-DE" };
const CURRENCY_SYMBOLS = { TRY: "₺", USD: "$", GBP: "£", EUR: "€" };
const CURRENCIES = ["TRY", "USD", "GBP", "EUR"];

function formatMoney(amount, currency = "TRY") {
  const locale = CURRENCY_LOCALES[currency] || "tr-TR";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

export default function AdminCreditCardRow({ card }) {
  const router = useRouter();
  const [balance, setBalance] = useState(card.balance.toString());
  const [creditLimit, setCreditLimit] = useState(card.creditLimit.toString());
  const [currency, setCurrency] = useState(card.currency || "TRY");
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setBalance(card.balance.toString());
    setCreditLimit(card.creditLimit.toString());
    setCurrency(card.currency || "TRY");
  }, [card.balance, card.creditLimit, card.currency]);

  async function patch(body) {
    const res = await fetch(`/api/admin/credit-cards/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");
    return data;
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus(null);
    setSaving(true);
    try {
      await patch({ balance: Number(balance), creditLimit: Number(creditLimit), currency });
      setStatus({ type: "success", message: "Card updated." });
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

  const currencyChanged = currency !== (card.currency || "TRY");

  return (
    <div className="mt-3 border border-border rounded-lg p-4">
      <p className="text-sm font-medium text-text">•••• {card.cardNumber.slice(-4)}</p>
      <p className="text-xs text-text-secondary mt-1">
        {formatMoney(card.balance, card.currency || "TRY")} balance of {formatMoney(card.creditLimit, card.currency || "TRY")} limit
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

      <form onSubmit={handleSave} className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-text-secondary text-sm">{CURRENCY_SYMBOLS[currency] || currency}</span>
        <input
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="Balance"
          className="w-28 px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          step="0.01"
          value={creditLimit}
          onChange={(e) => setCreditLimit(e.target.value)}
          placeholder="Limit"
          className="w-28 px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
          {saving ? "Saving…" : "Update card"}
        </button>
      </form>

      {currencyChanged && (
        <button
          type="button"
          onClick={handleConvert}
          disabled={converting}
          className="mt-2 text-sm text-primary font-medium hover:underline disabled:opacity-50"
        >
          {converting ? "Converting…" : `Convert balance & limit to ${currency} at today's rate`}
        </button>
      )}
    </div>
  );
}
