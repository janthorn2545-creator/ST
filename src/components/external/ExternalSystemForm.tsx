"use client";

import { useActionState } from "react";
import { Field, TextInput, TextArea, Select, FormActions, SubmitButton } from "@/components/form";
import type { FormState } from "@/app/actions/external-systems";

type Initial = {
  name: string;
  description: string | null;
  url: string;
  embedMode: string;
  order: number;
};

export function ExternalSystemForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: Initial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <Field label="ชื่อระบบ" htmlFor="name" required>
        <TextInput id="name" name="name" required defaultValue={initial?.name} />
      </Field>

      <Field label="คำอธิบาย" htmlFor="description">
        <TextArea id="description" name="description" rows={2} defaultValue={initial?.description ?? ""} />
      </Field>

      <Field label="URL" htmlFor="url" required>
        <TextInput
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://..."
          defaultValue={initial?.url}
        />
      </Field>

      <Field label="รูปแบบการเปิดใช้งาน" htmlFor="embedMode" required>
        <Select id="embedMode" name="embedMode" required defaultValue={initial?.embedMode ?? "LINK"}>
          <option value="LINK">เปิดลิงก์ในแท็บใหม่</option>
          <option value="IFRAME">แสดงผลภายในหน้าเว็บ (embed)</option>
        </Select>
      </Field>

      <Field label="ลำดับการแสดงผล" htmlFor="order">
        <TextInput id="order" name="order" type="number" defaultValue={initial?.order ?? 0} />
      </Field>

      {state?.error && (
        <p className="rounded-2xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-500">{state.error}</p>
      )}

      <FormActions>
        <SubmitButton pending={pending} label={submitLabel} pendingLabel="กำลังบันทึก..." />
      </FormActions>
    </form>
  );
}
