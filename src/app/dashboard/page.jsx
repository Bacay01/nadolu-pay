import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getFrozenNotice } from "@/lib/frozen";
import AppHeader from "@/components/AppHeader";
import MobileHeader from "@/components/MobileHeader";
import MobileQuickActions from "@/components/MobileQuickActions";
import MobileSnapshotCard from "@/components/MobileSnapshotCard";
import MobileAccountCard from "@/components/MobileAccountCard";
import MobileCreditCardCard from "@/components/MobileCreditCardCard";
import BottomNav from "@/components/BottomNav";
import AccountCard from "@/components/AccountCard";
import CreditCardSummaryCard from "@/components/CreditCardSummaryCard";
import SnapshotCard from "@/components/SnapshotCard";
import QuickActionsCard from "@/components/QuickActionsCard";
import RecentActivityCard from "@/components/RecentActivityCard";
import LinkExternalAccountsCard from "@/components/LinkExternalAccountsCard";
import OpenAccountSection from "@/components/OpenAccountSection";

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));
}

const typeLabels = { checking: "Checking", savings: "Savings" };

function KebabIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  const [accounts, creditCards] = await Promise.all([
    prisma.account.findMany({
      where: { userId: session.user.id },
      include: {
        sentTx: { orderBy: { createdAt: "desc" }, take: 5, include: { to: true } },
        receivedTx: { orderBy: { createdAt: "desc" }, take: 5, include: { from: true } },
      },
    }),
    prisma.creditCard.findMany({ where: { userId: session.user.id } }),
  ]);

  const checking = accounts.find((a) => a.type === "checking");
  const savings = accounts.find((a) => a.type === "savings");
  const card = creditCards[0];
  const frozenNotice = getFrozenNotice(accounts);

  const accountIds = accounts.map((a) => a.id);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthTxns = accountIds.length
    ? await prisma.transaction.findMany({
        where: {
          createdAt: { gte: startOfMonth },
          OR: [{ fromId: { in: accountIds } }, { toId: { in: accountIds } }],
        },
      })
    : [];

  const monthlyNet = monthTxns.reduce((sum, t) => {
    const amt = Number(t.amount);
    if (accountIds.includes(t.toId)) sum += amt;
    if (accountIds.includes(t.fromId)) sum -= amt;
    return sum;
  }, 0);

  const recent = accounts
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
  .slice(0, 5);



  const alerts = [];
  if (checking && Number(checking.balance) < 100) {
    alerts.push(`Your checking balance is low: ${formatMoney(checking.balance)}.`);
  }
  if (card && Number(card.creditLimit) > 0 && Number(card.balance) / Number(card.creditLimit) > 0.8) {
    alerts.push(`You're close to your credit limit on the card ending ${card.cardNumber.slice(-4)}.`);
  }

  return (
    <main className="min-h-screen bg-page">
      <div className="hidden md:block">
        <AppHeader frozenNotice={frozenNotice} />
      </div>
      <MobileHeader />

      {alerts.length > 0 && (
        <div className="px-4 md:px-6 pt-4 md:max-w-7xl md:mx-auto space-y-2">
          {alerts.map((msg, i) => (
            <p key={i} className="text-sm text-danger bg-danger/10 border border-danger/20 rounded px-4 py-2">
              {msg}
            </p>
          ))}
        </div>
      )}

      <div className="md:hidden pb-24">
        <MobileQuickActions />
        <div className="mt-2">
          <MobileSnapshotCard monthlyNet={monthlyNet} frozenNotice={frozenNotice} />
        </div>

        <h2 className="mt-6 px-4 text-[26px] font-bold text-text">Accounts</h2>
        <div className="mt-3 px-4 space-y-4">
          {checking && <MobileAccountCard type="checking" account={checking} />}
          {savings && <MobileAccountCard type="savings" account={savings} />}
          {card && <MobileCreditCardCard card={card} />}
        </div>

        <div className="mt-4 px-4">
          <RecentActivityCard transactions={recent} viewAllHref="/transactions" />
        </div>

        <div className="mt-4 px-4">
          <LinkExternalAccountsCard />
        </div>

        <div className="mt-6 px-4">
          <OpenAccountSection />
        </div>
      </div>

      <div className="hidden md:block max-w-7xl mx-auto px-6 sm:px-10 py-10">
        <h1 className="text-2xl font-bold text-navy">Welcome back, {session.user.name?.split(" ")[0]}</h1>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-[28px] font-bold text-text">Accounts</h2>
          <button
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-surface transition-colors"
            title="More options (coming soon)"
            aria-label="More options"
          >
            <KebabIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <SnapshotCard monthlyNet={monthlyNet} frozenNotice={frozenNotice} />
          <QuickActionsCard />
        </div>

        <div className="mt-6 space-y-5">
          {checking && <AccountCard type="checking" account={checking} />}
          {savings && <AccountCard type="savings" account={savings} />}
          {card && <CreditCardSummaryCard card={card} />}
        </div>

        <div className="mt-6">
          <RecentActivityCard transactions={recent} viewAllHref="/transactions" />
        </div>

        <div className="mt-6">
          <LinkExternalAccountsCard />
        </div>

        <div className="mt-8">
          <OpenAccountSection />
        </div>
      </div>

      <BottomNav frozenNotice={frozenNotice} />
    </main>
  );
}