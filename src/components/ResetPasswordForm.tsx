"use client";

import { useActionState } from "react";
import { resetPassword, type ResetPasswordState } from "@/app/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

export function ResetPasswordForm({ token }: { token: string }) {
  const boundAction = resetPassword.bind(null, token) as (
    state: ResetPasswordState,
    formData: FormData,
  ) => Promise<ResetPasswordState>;
  const [state, action, pending] = useActionState(boundAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="lbl">
          รหัสผ่านใหม่
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
        {pending ? "กำลังบันทึก..." : "ตั้งรหัสผ่านใหม่"}
      </button>
    </form>
  );
}
