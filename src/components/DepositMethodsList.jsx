function CheckDepositIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function BankIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 21 8 3 8" />
    </svg>
  );
}

function ChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

const options = [
  {
    icon: CheckDepositIcon,
    iconBg: "bg-primary-light",
    iconColor: "text-primary",
    title: "Mobile Check Deposit",
    subtitle: "Snap a photo to deposit a check",
  },
  {
    icon: BankIcon,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    title: "Bank Transfer",
    subtitle: "Deposit from an external bank account",
  },
];

export default function DepositMethodsList() {
  return (
    <div className="mt-5 bg-surface rounded-2xl border border-border overflow-hidden">
      {options.map(({ icon: Icon, iconBg, iconColor, title, subtitle }, i) => (
        <button
          key={title}
          disabled
          title="Coming soon"
          className={`w-full flex items-center gap-4 px-5 py-4 text-left cursor-not-allowed ${
            i !== options.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </span>
          <span className="flex-1">
            <span className="block text-[17px] font-bold text-text">{title}</span>
            <span className="block text-sm text-text-secondary mt-0.5">{subtitle}</span>
          </span>
          <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
        </button>
      ))}
    </div>
  );
}