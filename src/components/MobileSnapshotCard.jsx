import FrozenGuardedLink from "./FrozenGuardedLink";

function ChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function MoneyBagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 5c-1.5 2-2 3.5-2 5a5 5 0 0 0 10 0c0-1.5-.5-3-2-5" />
      <path d="M10 5h4" />
      <path d="M6 14c-1 2-1 4 0 6a3 3 0 0 0 2 1h8a3 3 0 0 0 2-1c1-2 1-4 0-6" />
    </svg>
  );
}

function formatMoney(amount) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(amount))}`;
}

export default function MobileSnapshotCard({ monthlyNet, frozenNotice }) {
  return (
    <FrozenGuardedLink
      href="/transactions"
      frozenNotice={frozenNotice}
      className="md:hidden block bg-surface border border-border rounded-2xl mx-4 px-4 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <MoneyBagIcon className="w-4 h-4" />
          <span className="text-navy font-semibold">Snapshot</span>
        </div>
        <ChevronRight className="w-4 h-4 text-text-secondary" />
      </div>
      <p className="mt-2 text-sm text-text-secondary">Your money this month is {formatMoney(monthlyNet)}.</p>
    </FrozenGuardedLink>
  );
}