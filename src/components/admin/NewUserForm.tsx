"use client";

import { useActionState } from "react";
import { Field, TextInput, Select, FormActions, SubmitButton } from "@/components/form";
import { createUser, type FormState } from "@/app/actions/users";

export function NewUserForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createUser, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <Field label="ชื่อ-นามสกุล" htmlFor="name" required>
        <TextInput id="name" name="name" required />
      </Field>

      <Field label="อีเมล" htmlFor="email" required>
        <TextInput id="email" name="email" type="email" required />
      </Field>

      <Field label="รหัสผ่านเริ่มต้น" htmlFor="password" required>
        <TextInput id="password" name="password" type="password" required minLength={8} />
      </Field>

      <Field label="สิทธิ์การใช้งาน" htmlFor="role" required>
        <Select id="role" name="role" required defaultValue="EMPLOYEE">
          <option value="EMPLOYEE">พนักงาน</option>
          <option value="ADMIN">ผู้ดูแลระบบ</option>
        </Select>
      </Field>

      {state?.error && (
        <p className="rounded-2xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-500">{state.error}</p>
      )}

      <FormActions>
        <SubmitButton pending={pending} label="สร้างผู้ใช้งาน" pendingLabel="กำลังบันทึก..." />
      </FormActions>
    </form>
  );
}
