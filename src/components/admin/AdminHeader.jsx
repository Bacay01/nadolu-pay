"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminHeader({ adminName }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight">Chase</span>
          <span className="text-xs font-bold uppercase tracking-wide bg-danger text-white px-2 py-0.5 rounded">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          {adminName && <span className="text-white/60">{adminName}</span>}
          <button onClick={handleSignOut} className="text-white/80 hover:text-white">
            Sign out
          </button>
        </div>
      </div>
      <nav className="flex items-center h-11 px-6 gap-6 border-b border-white/10 border-t border-white/10">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`h-full flex items-center text-sm font-semibold border-b-2 ${
                active ? "text-white border-white" : "text-white/70 border-transparent hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}