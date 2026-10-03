function SendIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function WireIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function BillsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
    icon: SendIcon,
    iconBg: "bg-[#7C4FE0]/10",
    iconColor: "text-[#7C4FE0]",
    title: "QuickPay",
    subtitle: "Send money to friends & family",
  },
  {
    icon: WireIcon,
    iconBg: "bg-primary-light",
    iconColor: "text-primary",
    title: "Wire Transfer",
    subtitle: "Domestic and international wires",
  },
  {
    icon: BillsIcon,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    title: "Pay Bills",
    subtitle: "Pay utilities, credit cards, loans",
  },
];

export default function TransferOptionsList() {
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