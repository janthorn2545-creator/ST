"use client";

import { useActionState } from "react";
import { Field, TextInput, TextArea, FormActions, SubmitButton } from "@/components/form";
import type { FormState } from "@/app/actions/medications";

type Initial = {
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minStock: number;
  location: string | null;
  expiryDate: Date | null;
  note: string | null;
};

export function MedicationForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: Initial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const expiryValue = initial?.expiryDate
    ? new Date(initial.expiryDate.getTime() - initial.expiryDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10)
    : undefined;

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <Field label="ชื่อยา" htmlFor="name" required>
        <TextInput id="name" name="name" required defaultValue={initial?.name} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="หมวดหมู่" htmlFor="category" required>
          <TextInput
            id="category"
            name="category"
            required
            placeholder="เช่น ยาสามัญ, เวชภัณฑ์"
            defaultValue={initial?.category}
          />
        </Field>
        <Field label="หน่วยนับ" htmlFor="unit" required>
          <TextInput id="unit" name="unit" required placeholder="เม็ด, ขวด, กล่อง" defaultValue={initial?.unit} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="จำนวนคงเหลือ" htmlFor="quantity" required>
          <TextInput
            id="quantity"
            name="quantity"
            type="number"
            min={0}
            required
            defaultValue={initial?.quantity ?? 0}
          />
        </Field>
        <Field label="เกณฑ์ขั้นต่ำ (แจ้งเตือน)" htmlFor="minStock">
          <TextInput
            id="minStock"
            name="minStock"
            type="number"
            min={0}
            defaultValue={initial?.minStock ?? 0}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="สถานที่จัดเก็บ" htmlFor="location">
          <TextInput id="location" name="location" defaultValue={initial?.location ?? ""} />
        </Field>
        <Field label="วันหมดอายุ" htmlFor="expiryDate">
          <TextInput id="expiryDate" name="expiryDate" type="date" defaultValue={expiryValue} />
        </Field>
      </div>

      <Field label="หมายเหตุ" htmlFor="note">
        <TextArea id="note" name="note" rows={3} defaultValue={initial?.note ?? ""} />
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
