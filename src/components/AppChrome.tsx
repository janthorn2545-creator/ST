"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { HomeIcon, SettingsIcon, LogoutIcon } from "@/components/icons";

export type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "ผู้ดูแลระบบ",
  EMPLOYEE: "พนักงาน",
};

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
        ST
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">แผนก ST</p>
        <p className="text-xs text-slate-500">Safety Dashboard</p>
      </div>
    </div>
  );
}

function NavLinks({ navItems, isAdmin, onNavigate }: { navItems: NavItem[]; isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const active = href === "/dashboard" ? pathname === href : pathname?.startsWith(href);
    return [
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active ? "bg-amber-500/15 text-amber-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    ].join(" ");
  };

  return (
    <nav className="flex flex-1 flex-col gap-1">
      <Link href="/dashboard" className={linkClass("/dashboard")} onClick={onNavigate}>
        <HomeIcon className="h-5 w-5" />
        หน้าหลัก
      </Link>

      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={linkClass(item.href)} onClick={onNavigate}>
          {item.icon}
          {item.label}
        </Link>
      ))}

      {isAdmin && (
        <>
          <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            ผู้ดูแลระบบ
          </div>
          <Link href="/admin" className={linkClass("/admin")} onClick={onNavigate}>
            <SettingsIcon className="h-5 w-5" />
            ตั้งค่าระบบ
          </Link>
        </>
      )}
    </nav>
  );
}

export function AppChrome({
  navItems,
  isAdmin,
  name,
  role,
  children,
}: {
  navItems: NavItem[];
  isAdmin: boolean;
  name: string;
  role: string;
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-1 bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <div className="mb-8">
          <Brand />
        </div>
        <NavLinks navItems={navItems} isAdmin={isAdmin} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="ปิดเมนู"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative flex h-full w-64 flex-col bg-white px-4 py-6 shadow-xl">
            <div className="mb-8">
              <Brand />
            </div>
            <NavLinks navItems={navItems} isAdmin={isAdmin} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-8">
          <button
            type="button"
            aria-label="เปิดเมนู"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{name}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[role] ?? role}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                title="ออกจากระบบ"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <LogoutIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
