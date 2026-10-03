import Link from "next/link";

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ActionPill({ children, href, disabled }) {
  const base = "shrink-0 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-[0_1px_3px_rgba(0,0,0,0.08)]";
  if (disabled) {
    return (
      <span className={`${base} bg-surface text-primary/40 cursor-not-allowed`} title="Coming soon">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={`${base} bg-surface text-primary`}>
      {children}
    </Link>
  );
}

export default function MobileQuickActions() {
  return (
    <div className="md:hidden bg-page px-4 py-3">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        <Link
          href="/transfer"
          className="shrink-0 w-16 h-11 rounded-full bg-surface flex items-center justify-center text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          aria-label="Send money"
        >
          <PlusIcon className="w-5 h-5" />
        </Link>
        <ActionPill href="/transfer">Send</ActionPill>
        <ActionPill disabled>Deposit checks</ActionPill>
        <ActionPill disabled>Pay bills</ActionPill>
        <ActionPill disabled>Transfer</ActionPill>
      </div>
    </div>
  );
}