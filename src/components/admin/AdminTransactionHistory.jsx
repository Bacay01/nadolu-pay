"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminTransactionHistory({ accountId, transactions }) {
  const router = useRouter();
  const [type, setType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [externalLabel, setExternalLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editExternalLabel, setEditExternalLabel] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [status, setStatus] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    setStatus(null);
    setAdding(true);
    try {
      const res = await fetch(`/api/admin/accounts/${accountId}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount: Number(amount), description, externalLabel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add transaction");
      setAmount("");
      setDescription("");
      setExternalLabel("");
      setStatus({ type: "success", message: "Transaction added." });
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setAdding(false);
    }
  }

  function startEdit(txn) {
    setEditingId(txn.id);
    setEditAmount(txn.amount.toString());
    setEditDescription(txn.description || "");
    setEditExternalLabel(txn.externalLabel || "");
  }

  async function handleSaveEdit(id) {
    setStatus(null);
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(editAmount), description: editDescription, externalLabel: editExternalLabel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update transaction");
      setEditingId(null);
      setStatus({ type: "success", message: "Transaction updated." });
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this transaction? The balance change it caused will be reversed.")) return;
    setStatus(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete transaction");
      setStatus({ type: "success", message: "Transaction deleted and balance reversed." });
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-xs font-medium text-text-secondary">Transaction history</p>

      {status && (
        <p
          className={`mt-2 text-xs rounded px-2 py-1 border ${
            status.type === "success" ? "text-success border-success/30 bg-success/10" : "text-danger border-danger/30 bg-danger/10"
          }`}
        >
          {status.message}
        </p>
      )}

      <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
        {transactions.length === 0 && <p className="text-xs text-text-secondary">No transactions yet.</p>}
        {transactions.map((txn) => (
          <div key={txn.id} className="text-xs border border-border rounded-md px-2 py-2">
            {editingId === txn.id ? (
              <div className="flex flex-col gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="px-2 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="px-2 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Source / destination label (optional, e.g. 'Employer Payroll')"
                  value={editExternalLabel}
                  onChange={(e) => setEditExternalLabel(e.target.value)}
                  className="px-2 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSaveEdit(txn.id)}
                    disabled={savingEdit}
                    className="text-primary font-medium hover:underline disabled:opacity-50"
                  >
                    {savingEdit ? "Saving…" : "Save"}
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-text-secondary hover:text-text">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-text truncate">{txn.description || (txn.direction === "credit" ? "Credit" : "Debit")}</p>
                  {txn.externalLabel && <p className="text-text-secondary italic truncate">Label: {txn.externalLabel}</p>}
                  <p className="text-text-secondary">{formatDate(txn.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={txn.direction === "credit" ? "text-success font-medium" : "text-text font-medium"}>
                    {txn.direction === "credit" ? "+" : "-"}
                    {formatMoney(txn.amount)}
                  </span>
                  <button onClick={() => startEdit(txn)} className="text-primary hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(txn.id)}
                    disabled={deletingId === txn.id}
                    className="text-danger hover:underline disabled:opacity-50"
                  >
                    {deletingId === txn.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="mt-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-2 py-1.5 text-xs border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="credit">Credit (add money)</option>
            <option value="debit">Debit (remove money)</option>
          </select>
          <input
            type="number"
            step="0.01"
            required
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-2 py-1.5 text-xs border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-2 py-1.5 text-xs border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          placeholder="Source / destination label (optional, e.g. 'Employer Payroll')"
          value={externalLabel}
          onChange={(e) => setExternalLabel(e.target.value)}
          className="px-2 py-1.5 text-xs border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={adding}
          className="self-start text-xs text-primary font-medium hover:underline disabled:opacity-50"
        >
          {adding ? "Adding…" : "+ Add transaction"}
        </button>
      </form>
    </div>
  );
}