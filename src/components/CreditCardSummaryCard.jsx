function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));
}

export default function CreditCardSummaryCard({ card }) {
  const available = Number(card.creditLimit) - Number(card.balance);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="bg-navy text-white px-5 flex items-center min-h-[68px]">
        <span className="text-sm font-semibold tracking-wide">CREDIT CARDS (1)</span>
      </div>

      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[17px] font-medium text-text">Chase Credit Card</p>
          <p className="text-[14px] text-text-secondary mt-0.5">•••• {card.cardNumber.slice(-4)}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[13px] text-text-secondary">Current balance</p>
          <p className="text-[38px] font-semibold text-text leading-tight">{formatMoney(card.balance)}</p>          <p className="text-xs text-text-secondary mt-1">{formatMoney(available)} available</p>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-border flex gap-5 text-sm font-medium">
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          View card
        </span>
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Make a payment
        </span>
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Statements
        </span>
      </div>
    </div>
  );
}