import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { accounts: true, creditCards: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Users ({users.length})</h1>

      <div className="mt-6 bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-page text-text-secondary text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Name</th>
              <th className="text-left px-5 py-3 font-semibold">Email</th>
              <th className="text-left px-5 py-3 font-semibold">Accounts</th>
              <th className="text-left px-5 py-3 font-semibold">Joined</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-5 py-4 text-text">{u.name}</td>
                <td className="px-5 py-4 text-text-secondary">{u.email}</td>
                <td className="px-5 py-4 text-text-secondary">
                  {u.accounts.length} account{u.accounts.length !== 1 ? "s" : ""}, {u.creditCards.length} card
                  {u.creditCards.length !== 1 ? "s" : ""}
                </td>
                <td className="px-5 py-4 text-text-secondary">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/users/${u.id}`} className="text-primary font-medium hover:underline">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}