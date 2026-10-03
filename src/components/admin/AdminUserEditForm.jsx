"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUserEditForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setStatus(null);
    setSaving(true);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: password || undefined }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setStatus({ type: "error", message: data.error || "Update failed" });
      return;
    }
    setPassword("");
    setStatus({ type: "success", message: "Saved." });
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete ${user.name}? This removes their accounts, cards, and transaction history permanently.`)) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json();
      setStatus({ type: "error", message: data.error || "Delete failed" });
      return;
    }
    router.push("/admin/users");
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-navy">User details</h2>

      {status && (
        <p
          className={`mt-3 text-sm rounded-md px-3 py-2 border ${
            status.type === "success" ? "text-success border-success/30 bg-success/10" : "text-danger border-danger/30 bg-danger/10"
          }`}
        >
          {status.message}
        </p>
      )}

      <form onSubmit={handleSave} className="mt-4">
        <label className="block text-sm font-medium text-text">Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block mt-4 text-sm font-medium text-text">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block mt-4 text-sm font-medium text-text">New password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
          className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="mt-1 text-xs text-text-secondary">Only fill this in to reset the customer's password.</p>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-danger text-sm font-medium hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete user"}
          </button>
        </div>
      </form>
    </div>
  );
}