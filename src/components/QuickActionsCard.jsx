import Link from "next/link";

function ActionButton({ children, href, primary, disabled }) {
  const base = "px-4 py-2.5 rounded-md text-sm font-medium text-center transition-colors";

  if (primary) {
    return (
      <Link href={href} className={`${base} bg-primary text-white hover:bg-primary-dark`}>
        {children}
      </Link>
    );
  }
  if (disabled) {
    return (
      <span className={`${base} bg-white border border-border text-disabled cursor-not-allowed`} title="Coming soon">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={`${base} bg-white border border-border text-primary hover:bg-page`}>
      {children}
    </Link>
  );
}

export default function QuickActionsCard() {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] h-full">
      <h3 className="text-[20px] font-semibold text-navy">Quick actions</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <ActionButton href="/transfer" primary>
          + Send money
        </ActionButton>
        <ActionButton disabled>Deposit checks</ActionButton>
        <ActionButton disabled>Pay bills</ActionButton>
        <ActionButton disabled>Transfer</ActionButton>
      </div>
    </div>
  );
}