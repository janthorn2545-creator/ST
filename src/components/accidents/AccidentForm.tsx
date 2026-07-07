"use client";

import { useActionState } from "react";
import { Field, TextInput, TextArea, Select, FormActions, SubmitButton } from "@/components/form";
import { SEVERITY_LABEL, STATUS_LABEL } from "@/components/accidents/badges";
import type { FormState } from "@/app/actions/accidents";

type Initial = {
  date: Date;
  location: string;
  severity: string;
  status: string;
  injuredCount: number;
  description: string;
  correctiveAction: string | null;
};

export function AccidentForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: Initial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const dateValue = initial?.date
    ? new Date(initial.date.getTime() - initial.date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10)
    : undefined;

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="วันที่เกิดเหตุ" htmlFor="date" required>
          <TextInput id="date" name="date" type="date" required defaultValue={dateValue} />
        </Field>
        <Field label="จำนวนผู้บาดเจ็บ" htmlFor="injuredCount">
          <TextInput
            id="injuredCount"
            name="injuredCount"
            type="number"
            min={0}
            defaultValue={initial?.injuredCount ?? 0}
          />
        </Field>
      </div>

      <Field label="สถานที่เกิดเหตุ" htmlFor="location" required>
        <TextInput id="location" name="location" required defaultValue={initial?.location} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="ความรุนแรง" htmlFor="severity" required>
          <Select id="severity" name="severity" required defaultValue={initial?.severity ?? "MINOR"}>
            {Object.entries(SEVERITY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="สถานะ" htmlFor="status" required>
          <Select id="status" name="status" required defaultValue={initial?.status ?? "OPEN"}>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="รายละเอียดเหตุการณ์" htmlFor="description" required>
        <TextArea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={initial?.description}
        />
      </Field>

      <Field label="มาตรการแก้ไข/ป้องกัน" htmlFor="correctiveAction">
        <TextArea
          id="correctiveAction"
          name="correctiveAction"
          rows={3}
          defaultValue={initial?.correctiveAction ?? ""}
        />
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
