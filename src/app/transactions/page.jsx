import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getFrozenNotice } from "@/lib/frozen";
import AppHeader from "@/components/AppHeader";
import MobileHeader from "@/components/MobileHeader";
import BottomNav from "@/components/BottomNav";
import RecentActivityCard from "@/components/RecentActivityCard";

const typeLabels = { checking: "Checking", savings: "Savings" };
const HISTORY_LIMIT = 20;

export default async function TransactionsPage() {
  const session = await auth();

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    include: {
      sentTx: { orderBy: { createdAt: "desc" }, take: HISTORY_LIMIT, include: { to: true } },
      receivedTx: { orderBy: { createdAt: "desc" }, take: HISTORY_LIMIT, include: { from: true } },
    },
  });

  const frozenNotice = getFrozenNotice(accounts);

  const history = accounts
    .flatMap((acc) => [
      ...acc.sentTx.map((t) => ({
        ...t,
        direction: "sent",
        counterparty: t.to ? t.to.accountNumber : t.externalLabel || "an admin adjustment",
        fromLabel: `${typeLabels[acc.type] || acc.type} ••${acc.accountNumber.slice(-4)}`,
      })),
      ...acc.receivedTx.map((t) => ({
        ...t,
        direction: "received",
        counterparty: t.from ? t.from.accountNumber : t.externalLabel || "an admin adjustment",
        fromLabel: t.from
          ? `${typeLabels[t.from.type] || t.from.type} ••${t.from.accountNumber.slice(-4)}`
          : t.externalLabel || "an admin adjustment",
      })),
    ])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, HISTORY_LIMIT);

  return (
    <main className="min-h-screen bg-page">
      <div className="hidden md:block">
        <AppHeader frozenNotice={frozenNotice} />
      </div>
      <MobileHeader />

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-10 pb-24 md:pb-10">
        <h1 className="text-2xl font-bold text-navy mb-6">All transactions</h1>
        <RecentActivityCard transactions={history} title={`Last ${HISTORY_LIMIT} transactions`} />
      </div>

      <BottomNav frozenNotice={frozenNotice} />
    </main>
  );
}