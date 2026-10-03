import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getFrozenNotice } from "@/lib/frozen";
import AppHeader from "@/components/AppHeader";
import MobileHeader from "@/components/MobileHeader";
import BottomNav from "@/components/BottomNav";
import DepositByCardForm from "@/components/DepositByCardForm";
import DepositMethodsList from "@/components/DepositMethodsList";
import RecentActivityCard from "@/components/RecentActivityCard";

export default async function DepositPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    orderBy: { type: "asc" },
  });

  const accountIds = accounts.map((a) => a.id);
  const frozenNotice = getFrozenNotice(accounts);

  const plainAccounts = accounts.map((a) => ({
    id: a.id,
    accountNumber: a.accountNumber,
    type: a.type,
    balance: Number(a.balance),
    frozen: a.frozen,
    frozenReason: a.frozenReason,
  }));

  const deposits = accountIds.length
    ? await prisma.transaction.findMany({
        where: { toId: { in: accountIds }, fromId: null },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];

  const depositRows = deposits.map((t) => ({ ...t, direction: "received" }));

  return (
    <main className="min-h-screen bg-page">
      <div className="hidden md:block">
        <AppHeader frozenNotice={frozenNotice} />
      </div>
      <MobileHeader />

      <div className="max-w-md mx-auto px-4 md:px-6 py-8 md:py-10 pb-24 md:pb-10">
        <DepositByCardForm accounts={plainAccounts} />
        <DepositMethodsList />
        <div className="mt-5">
          <RecentActivityCard transactions={depositRows} title="Deposit history" />
        </div>
      </div>

      <BottomNav frozenNotice={frozenNotice} />
    </main>
  );
}