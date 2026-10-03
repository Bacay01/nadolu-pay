"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FrozenGuardedLink from "./FrozenGuardedLink";

function AccountsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function TransferIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3l4 4-4 4" />
      <path d="M21 7H9" />
      <path d="M7 21l-4-4 4-4" />
      <path d="M3 17h12" />
    </svg>
  );
}

function PlanIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-6 4 3 4-7" />
    </svg>
  );
}

function OffersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 12l-8-8H5a1 1 0 0 0-1 1v7l8 8 8-8z" />
      <circle cx="8.5" cy="8.5" r="1" />
    </svg>
  );
}

function MoreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

const items = [
  { href: "/dashboard", label: "Accounts", icon: AccountsIcon },
  { href: "/transfer", label: "Pay & transfer", icon: TransferIcon },
  { href: "/plan-track", label: "Plan & track", icon: PlanIcon, guarded: true },
  { href: "/offers", label: "Offers", icon: OffersIcon, guarded: true },
  { href: "/more", label: "More", icon: MoreIcon, guarded: true },
];

export default function BottomNav({ frozenNotice }) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-border pb-[env(safe-area-inset-bottom)] z-40">
      <div className="flex items-stretch h-[70px]">
        {items.map(({ href, label, icon: Icon, guarded }) => {
          const active = pathname === href;
          const linkClass = `flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
            active ? "text-primary" : "text-text-secondary"
          }`;

          if (guarded) {
            return (
              <FrozenGuardedLink key={href} href={href} frozenNotice={frozenNotice} className={linkClass}>
                <Icon className="w-5 h-5" />
                {label}
              </FrozenGuardedLink>
            );
          }

          return (
            <Link key={href} href={href} className={linkClass}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}