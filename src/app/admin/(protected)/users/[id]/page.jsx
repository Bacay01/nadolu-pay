import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminUserEditForm from "@/components/admin/AdminUserEditForm";
import AdminAccountRow from "@/components/admin/AdminAccountRow";

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));
}

export default async function AdminUserDetailPage({ params }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: {
        include: {
          sentTx: { orderBy: { createdAt: "desc" } },
          receivedTx: { orderBy: { createdAt: "desc" } },
        },
      },
      creditCards: true,
    },
  });

  if (!user) notFound();

  const plainUser = { id: user.id, name: user.name, email: user.email };

  const accounts = user.accounts.map((acc) => {
    const transactions = [
  ...acc.sentTx.map((t) => ({
    id: t.id,
    amount: Number(t.amount),
    description: t.description,
    externalLabel: t.externalLabel,
    direction: "debit",
    createdAt: t.createdAt,
  })),
  ...acc.receivedTx.map((t) => ({
    id: t.id,
    amount: Number(t.amount),
    description: t.description,
    externalLabel: t.externalLabel,
    direction: "credit",
    createdAt: t.createdAt,
  })),
].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      id: acc.id,
      accountNumber: acc.accountNumber,
      type: acc.type,
      balance: Number(acc.balance),
      frozen: acc.frozen,
      frozenReason: acc.frozenReason,
      transactions,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">{user.name}</h1>
      <p className="text-sm text-text-secondary mt-1">{user.email}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminUserEditForm user={plainUser} />

        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-navy">Accounts</h2>
          <div className="mt-4 space-y-3">
            {accounts.map((acc) => (
              <AdminAccountRow key={acc.id} account={acc} />
            ))}
            {accounts.length === 0 && <p className="text-sm text-text-secondary">No accounts.</p>}
          </div>

          {user.creditCards.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h2 className="text-lg font-semibold text-navy">Credit cards</h2>
              {user.creditCards.map((card) => (
                <div key={card.id} className="mt-3 border border-border rounded-lg p-4">
                  <p className="text-sm font-medium text-text">•••• {card.cardNumber.slice(-4)}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatMoney(card.balance)} balance of {formatMoney(card.creditLimit)} limit
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}