"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import NimbusLogo from "./NimbusLogo";

function BellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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

export default function MobileHeader() {
  return (
    <header className="md:hidden bg-page border-b border-border">
      <div className="h-14 flex items-center justify-between px-4">
        <button className="text-primary" aria-label="Notifications">
          <BellIcon className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-1.5 text-primary">
          <span className="font-bold text-base tracking-tight">Chase</span>
          <NimbusLogo className="w-5 h-5" />
        </Link>

        <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-primary" aria-label="Profile / sign out">
          <UserIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}