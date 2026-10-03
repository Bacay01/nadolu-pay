"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import NimbusLogo from "./NimbusLogo"
import FrozenGuardedLink from "./FrozenGuardedLink";

const navLinks = [
  { href: "/dashboard", label: "Accounts" },
  { href: "/transfer", label: "Pay & transfer" },
  { href: "/deposit-checks", label: "Collect & deposit" },
  { href: "/statements", label: "Tools & insights", guarded: true },
  { href: "/account-details", label: "Account management", guarded: true },
  { href: "/security", label: "Security", guarded: true },
];

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  );
}

function SignOutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function AppHeader({ frozenNotice }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-navy text-white">
      <div className="flex items-center justify-between px-3 sm:px-6 h-14 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 text-white/90 hover:text-white md:hidden shrink-0"
            aria-label="Menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-1.5 sm:gap-2 text-white min-w-0">
            <span className="font-bold text-base sm:text-lg tracking-tight shrink-0">Chase</span>
            <NimbusLogo className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="hidden sm:inline text-sm font-medium text-white/80 whitespace-nowrap">for Personal</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <button className="text-white/90 hover:text-white" aria-label="Search">
            <SearchIcon className="w-5 h-5" />
          </button>
          <button className="text-white/90 hover:text-white" aria-label="Profile">
            <UserIcon className="w-5 h-5" />
          </button>
          <Link
            href="/signup"
            className="hidden sm:inline-block bg-white text-navy text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Open an account
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 text-white/90 hover:text-white text-sm"
            aria-label="Sign out"
          >
            <SignOutIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      <nav className="hidden md:flex items-center h-12 px-6 gap-8 border-b border-white/10">
        {navLinks.map((l) => {
          const active = pathname === l.href;
          const linkClass = `h-full flex items-center text-[15px] font-semibold border-b-2 px-1 transition-colors ${
            active
              ? "text-white border-white"
              : "text-white/80 border-transparent hover:text-white hover:bg-white/10 hover:border-white/40"
          }`;

          if (l.guarded) {
            return (
              <FrozenGuardedLink key={l.href} href={l.href} frozenNotice={frozenNotice} className={linkClass}>
                {l.label}
              </FrozenGuardedLink>
            );
          }

          return (
            <Link key={l.href} href={l.href} className={linkClass}>
              {l.label}
            </Link>
          );
        })}
      </nav>

      
{menuOpen && (
  <nav className="md:hidden flex flex-col px-4 pb-4 gap-3">
    {navLinks.map((l) => {
      const linkClass = `text-sm font-semibold ${pathname === l.href ? "text-white" : "text-white/75"}`;

      if (l.guarded) {
        return (
          <FrozenGuardedLink
            key={l.href}
            href={l.href}
            frozenNotice={frozenNotice}
            className={linkClass}
          >
            {l.label}
          </FrozenGuardedLink>
        );
      }

      return (
        <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className={linkClass}>
          {l.label}
        </Link>
      );
    })}
  </nav>
)}
    </header>
  );
}