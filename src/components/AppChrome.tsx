"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Home, Settings, LogOut, Menu, ShieldCheck } from "lucide-react";

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
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
        <ShieldCheck className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">แผนก ST</p>
        <p className="text-xs font-medium text-slate-400">Safety Dashboard</p>
      </div>
    </div>
  );
}

function NavLinks({ navItems, isAdmin, onNavigate }: { navItems: NavItem[]; isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const active = href === "/dashboard" ? pathname === href : pathname?.startsWith(href);
    return [
      "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all",
      active
        ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-500 ring-1 ring-indigo-500/20"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white",
    ].join(" ");
  };

  return (
    <nav className="flex flex-1 flex-col gap-1">
      <Link href="/dashboard" className={linkClass("/dashboard")} onClick={onNavigate}>
        <Home className="h-5 w-5" />
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
          <div className="mt-4 mb-1 px-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            ผู้ดูแลระบบ
          </div>
          <Link href="/admin" className={linkClass("/admin")} onClick={onNavigate}>
            <Settings className="h-5 w-5" />
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
    <div className="flex min-h-screen flex-1 bg-slate-50 dark:bg-[#0f172a]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-6 md:flex">
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative flex h-full w-64 flex-col bg-white dark:bg-slate-900 px-4 py-6 shadow-xl">
            <div className="mb-8">
              <Brand />
            </div>
            <NavLinks navItems={navItems} isAdmin={isAdmin} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl px-4 py-3 md:px-8">
          <button
            type="button"
            aria-label="เปิดเมนู"
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
              <p className="text-xs font-medium text-slate-400">{ROLE_LABEL[role] ?? role}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                title="ออกจากระบบ"
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
