import Link from "next/link";

function formatMoney(amount) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(amount));
}

const typeLabels = { checking: "Checking", savings: "Savings" };

export default function AccountCard({ type, account }) {
  const label = typeLabels[type] || type;

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="bg-navy text-white px-5 flex items-center min-h-[68px]">
        <span className="text-sm font-semibold tracking-wide">{label.toUpperCase()} ACCOUNTS (1)</span>
      </div>

      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[17px] font-medium text-text flex items-center gap-2">
            Anadolu-Bank {label}
          </p>
          <p className="text-[14px] text-text-secondary mt-0.5">•••• {account.accountNumber.slice(-4)}</p>
                  </div>
        <div className="sm:text-right">
          <p className="text-[13px] text-text-secondary">Available balance</p>
          <p className="text-[38px] font-semibold text-text leading-tight">{formatMoney(account.balance)}</p>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-border flex gap-5 text-sm font-medium">
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          View account
        </span>
        <Link href="/transfer" className="text-primary hover:underline">
          Transfer money
        </Link>
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Pay a bill
        </span>
      </div>
    </div>
  );
}