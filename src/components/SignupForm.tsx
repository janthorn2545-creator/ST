"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="lbl">
          ชื่อ-นามสกุล
        </label>
        <input id="name" name="name" required className="inp" />
      </div>

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
          minLength={8}
          autoComplete="new-password"
          placeholder="อย่างน้อย 8 ตัวอักษร"
        />
      </div>

      {state?.error && (
        <p className="rounded-2xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-gradient w-full rounded-2xl py-3.5 text-sm font-bold disabled:opacity-60">
        {pending ? "กำลังสมัคร..." : "สมัครใช้งาน"}
      </button>

      <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="font-semibold text-indigo-500 hover:text-indigo-400">
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
