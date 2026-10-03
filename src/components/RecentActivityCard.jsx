import Link from "next/link";

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RecentActivityCard({ transactions, title = "Recent activity", viewAllHref }) {
  return (
    <div className="bg-surface border border-border rounded-lg">
      <h2 className="px-5 py-4 text-lg font-semibold text-navy border-b border-border">{title}</h2>

      {transactions.length === 0 ? (
        <p className="px-5 py-6 text-sm text-text-secondary">No transactions yet.</p>
      ) : (
        transactions.map((txn) => {
          const isCredit = txn.direction === "received";
          const amountClass = isCredit ? "text-success" : "text-danger";
          const counterpartyLabel = txn.counterparty || "an admin adjustment";

          return (
            <div key={txn.id} className="px-5 py-4 flex items-center justify-between border-b border-border last:border-b-0">
              <div>
                <p className="text-sm text-text">
                  {txn.description || (isCredit ? `Received from ${counterpartyLabel}` : `Sent to ${counterpartyLabel}`)}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {txn.fromLabel ? `From ${txn.fromLabel} · ` : ""}
                  {formatDate(txn.createdAt)}
                </p>
              </div>
              <p className={`text-sm font-medium ${amountClass}`}>
                {isCredit ? "+" : "-"}
                {formatMoney(txn.amount)}
              </p>
            </div>
          );
        })
      )}

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="block text-center px-5 py-3 text-sm text-primary font-medium border-t border-border hover:bg-page rounded-b-lg transition-colors"
        >
          More history
        </Link>
      )}
    </div>
  );
}