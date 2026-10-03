import FrozenGuardedLink from "./FrozenGuardedLink";

function formatMoney(amount) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(amount))}`;
}

export default function SnapshotCard({ monthlyNet, frozenNotice }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] h-full">
      <div className="flex items-center gap-2 text-primary">
        <h3 className="text-[20px] font-semibold text-navy">Snapshot</h3>
        <span className="text-xs text-text-secondary bg-page rounded-[4px] px-2 py-0.5">30 sec read</span>
      </div>
      <p className="mt-3 text-[17px] text-text-secondary">Your money this month is {formatMoney(monthlyNet)}.</p>
      <FrozenGuardedLink
        href="/transactions"
        frozenNotice={frozenNotice}
        className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
      >
        View details <span aria-hidden="true">→</span>
      </FrozenGuardedLink>
    </div>
  );
}