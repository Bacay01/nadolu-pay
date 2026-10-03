function CreditCardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function CheckingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function SavingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function BusinessIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

const products = [
  { icon: CreditCardIcon, label: "Credit Cards" },
  { icon: CheckingIcon, label: "Checking" },
  { icon: SavingsIcon, label: "Savings & CDs" },
  { icon: BusinessIcon, label: "Business" },
];

export default function OpenAccountSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-navy">Open an account</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {products.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="shrink-0 w-[135px] h-[150px] bg-surface border border-border rounded-xl flex flex-col items-center justify-center gap-3 text-center px-3 cursor-not-allowed"
            title="Coming soon"
            disabled
          >
            <Icon className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-text">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}