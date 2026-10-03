function ChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export default function LinkExternalAccountsCard() {
  return (
    <button
      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 flex items-center justify-between text-left cursor-not-allowed"
      title="Coming soon"
      disabled
    >
      <div>
        <p className="text-[15px] font-medium text-text">Link external accounts</p>
        <p className="text-xs text-text-secondary mt-0.5">Connect another bank account to manage your money in one place</p>
      </div>
      <ChevronRight className="w-4 h-4 text-text-secondary shrink-0 ml-3" />
    </button>
  );
}