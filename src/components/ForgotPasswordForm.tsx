"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  if (state?.success) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          หากมีบัญชีที่ใช้อีเมลนี้อยู่ในระบบ เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปทางอีเมลแล้ว
          กรุณาตรวจสอบกล่องข้อความ (รวมถึงโฟลเดอร์สแปม)
        </p>
        <Link href="/login" className="text-sm font-semibold text-indigo-500 hover:text-indigo-400">
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

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

      {state?.error && (
        <p className="rounded-2xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-gradient w-full rounded-2xl py-3.5 text-sm font-bold disabled:opacity-60">
        {pending ? "กำลังส่ง..." : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
      </button>

      <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        <Link href="/login" className="font-semibold text-indigo-500 hover:text-indigo-400">
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
