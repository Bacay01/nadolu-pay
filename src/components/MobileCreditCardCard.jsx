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

export default function MobileCreditCardCard({ card }) {
  const available = Number(card.creditLimit) - Number(card.balance);

  return (
    <div className="md:hidden bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="bg-navy text-white px-5 flex items-center min-h-[62px] rounded-t-2xl">
        <span className="text-sm font-semibold">Credit cards (1)</span>
      </div>
      <div className="px-5 py-4">
        <button className="w-full flex items-center justify-between text-[17px] font-medium text-text">
          <span>Chase Credit Card •••• {card.cardNumber.slice(-4)}</span>
          <ChevronRight className="w-4 h-4 text-text-secondary shrink-0 ml-2" />
        </button>
        <div className="mt-4 text-right">
          <p className="text-[40px] font-semibold text-text leading-tight">{formatMoney(card.balance)}</p>
          <p className="text-sm text-text-secondary mt-1">Current balance · {formatMoney(available)} available</p>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-border flex justify-center gap-6 text-sm font-medium text-primary">
        <span className="opacity-40 cursor-not-allowed" title="Coming soon">
          View card
        </span>
        <span className="opacity-40 cursor-not-allowed" title="Coming soon">
          Make a payment
        </span>
        <span className="opacity-40 cursor-not-allowed" title="Coming soon">
          Statements
        </span>
      </div>
    </div>
  );
}