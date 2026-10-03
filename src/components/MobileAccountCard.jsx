function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));
}

function ChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

const typeLabels = { checking: "Checking", savings: "Savings" };

export default function MobileAccountCard({ type, account }) {
  const label = typeLabels[type] || type;

  return (
    <div className="md:hidden bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="bg-navy text-white px-5 flex items-center min-h-[62px] rounded-t-2xl">
        <span className="text-sm font-semibold">Bank accounts (1)</span>
      </div>
      <div className="px-5 py-4">
        <button className="w-full flex items-center justify-between text-[17px] font-medium text-text">
          <span>
            Chase {label} •••• {account.accountNumber.slice(-4)}
            {account.frozen && <span className="text-xs font-semibold text-danger ml-2">FROZEN</span>}
          </span>
          <ChevronRight className="w-4 h-4 text-text-secondary shrink-0 ml-2" />
        </button>
        {account.frozen && account.frozenReason && (
          <p className="text-xs text-danger mt-1 text-left">{account.frozenReason}</p>
        )}
        <div className="mt-4 text-right">
          <p className="text-[40px] font-semibold text-text leading-tight">{formatMoney(account.balance)}</p>
          <p className="text-sm text-text-secondary mt-1">Available balance</p>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-border flex justify-center gap-6 text-sm font-medium text-primary">
        <span className="opacity-40 cursor-not-allowed" title="Coming soon">
          View account
        </span>
        <a href="/transfer" className="hover:underline">
          Transfer money
        </a>
        <span className="opacity-40 cursor-not-allowed" title="Coming soon">
          Pay a bill
        </span>
      </div>
    </div>
  );
}