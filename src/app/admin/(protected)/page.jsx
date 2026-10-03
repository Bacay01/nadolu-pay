import { prisma } from "@/lib/prisma";

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatCard({ label, value }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-text">{value}</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const [userCount, accountCount, cardCount, txnCount, accounts, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.account.count(),
    prisma.creditCard.count(),
    prisma.transaction.count(),
    prisma.account.findMany({ select: { balance: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
  ]);

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Overview</h1>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Users" value={userCount} />
        <StatCard label="Accounts" value={accountCount} />
        <StatCard label="Credit cards" value={cardCount} />
        <StatCard label="Transactions" value={txnCount} />
      </div>

      <div className="mt-4">
        <StatCard label="Total balance across all accounts" value={formatMoney(totalBalance)} />
      </div>

      <div className="mt-8 bg-surface border border-border rounded-lg">
        <h2 className="px-5 py-4 text-lg font-semibold text-navy border-b border-border">Recent signups</h2>
        {recentUsers.map((u) => (
          <div key={u.id} className="px-5 py-4 flex items-center justify-between border-b border-border last:border-b-0">
            <div>
              <p className="text-sm text-text">{u.name}</p>
              <p className="text-xs text-text-secondary mt-0.5">{u.email}</p>
            </div>
            <p className="text-xs text-text-secondary">{formatDate(u.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}