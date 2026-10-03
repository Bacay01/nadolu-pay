import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getFrozenNotice } from "@/lib/frozen";
import AppHeader from "@/components/AppHeader";
import MobileHeader from "@/components/MobileHeader";
import BottomNav from "@/components/BottomNav";
import TransferForm from "@/components/TransferForm";
import TransferOptionsList from "@/components/TransferOptionsList";

export default async function TransferPage() {
  const session = await auth();

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    orderBy: { type: "asc" },
  });

  const frozenNotice = getFrozenNotice(accounts);

  const plainAccounts = accounts.map((a) => ({
    id: a.id,
    accountNumber: a.accountNumber,
    type: a.type,
    balance: Number(a.balance),
    frozen: a.frozen,
    frozenReason: a.frozenReason,
  }));

  return (
    <main className="min-h-screen bg-page">
      <div className="hidden md:block">
        <AppHeader frozenNotice={frozenNotice} />
      </div>
      <MobileHeader />

      <div className="max-w-md mx-auto px-4 md:px-6 py-8 md:py-10 pb-24 md:pb-10">
        <TransferForm accounts={plainAccounts} frozenNotice={frozenNotice} />
        <TransferOptionsList />
      </div>

      <BottomNav frozenNotice={frozenNotice} />
    </main>
  );
}