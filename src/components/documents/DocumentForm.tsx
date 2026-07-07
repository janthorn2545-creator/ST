"use client";

import { useActionState } from "react";
import { Field, TextInput, TextArea, FormActions, SubmitButton } from "@/components/form";
import type { FormState } from "@/app/actions/documents";

export function DocumentForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: { title: string; category: string; description: string | null; url: string };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <Field label="ชื่อเอกสาร" htmlFor="title" required>
        <TextInput id="title" name="title" required defaultValue={initial?.title} />
      </Field>

      <Field label="หมวดหมู่" htmlFor="category" required>
        <TextInput
          id="category"
          name="category"
          required
          placeholder="เช่น นโยบาย, SOP, แบบฟอร์ม"
          defaultValue={initial?.category}
        />
      </Field>

      <Field label="รายละเอียด" htmlFor="description">
        <TextArea id="description" name="description" rows={3} defaultValue={initial?.description ?? ""} />
      </Field>

      <Field label="ลิงก์เอกสาร (URL)" htmlFor="url">
        <TextInput
          id="url"
          name="url"
          type="url"
          placeholder="https://..."
          defaultValue={initial?.url && !initial.url.startsWith("/uploads/") ? initial.url : ""}
        />
      </Field>

      <Field label="หรืออัปโหลดไฟล์" htmlFor="file">
        <input
          id="file"
          name="file"
          type="file"
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />
        {initial?.url?.startsWith("/uploads/") && (
          <p className="mt-1 text-xs text-slate-500">
            ไฟล์ปัจจุบัน:{" "}
            <a href={initial.url} target="_blank" rel="noopener noreferrer" className="underline">
              เปิดไฟล์
            </a>{" "}
            (อัปโหลดใหม่เพื่อแทนที่)
          </p>
        )}
      </Field>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <FormActions>
        <SubmitButton pending={pending} label={submitLabel} pendingLabel="กำลังบันทึก..." />
      </FormActions>
    </form>
  );
}
