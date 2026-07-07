"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

export function LoginForm({ resetSuccess }: { resetSuccess: boolean }) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="lbl">
          อีเมล
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="inp"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="lbl">
          รหัสผ่าน
        </label>
        <PasswordInput
          id="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
          />
          จดจำฉันไว้
        </label>
        <Link href="/forgot-password" className="font-semibold text-indigo-500 hover:text-indigo-400">
          ลืมรหัสผ่าน?
        </Link>
      </div>

      {resetSuccess && (
        <p className="rounded-2xl bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่
        </p>
      )}

      {state?.error && (
        <p className="rounded-2xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-gradient w-full rounded-2xl py-3.5 text-sm font-bold disabled:opacity-60">
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        ยังไม่มีบัญชี?{" "}
        <Link href="/signup" className="font-semibold text-indigo-500 hover:text-indigo-400">
          สมัครใช้งาน
        </Link>
      </p>
    </form>
  );
}
