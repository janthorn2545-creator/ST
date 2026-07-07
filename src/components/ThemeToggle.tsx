"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Reads the class the blocking init script already applied pre-hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title="สลับธีมสว่าง/มืด"
      className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 ring-1 ring-slate-300/70 dark:ring-slate-700/70 transition-transform hover:scale-110 ${className}`}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
