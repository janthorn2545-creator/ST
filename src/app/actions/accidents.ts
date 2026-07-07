"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { Severity, AccidentStatus } from "@/generated/prisma/client";

export type FormState = { error?: string } | undefined;

const SEVERITIES: Severity[] = ["MINOR", "MODERATE", "SEVERE"];
const STATUSES: AccidentStatus[] = ["OPEN", "INVESTIGATING", "CLOSED"];

function parseCommon(formData: FormData) {
  const date = String(formData.get("date") || "");
  const location = String(formData.get("location") || "").trim();
  const severity = String(formData.get("severity") || "") as Severity;
  const status = String(formData.get("status") || "") as AccidentStatus;
  const injuredCount = Number(formData.get("injuredCount") || 0);
  const description = String(formData.get("description") || "").trim();
  const correctiveAction = String(formData.get("correctiveAction") || "").trim();

  if (!date || Number.isNaN(Date.parse(date))) {
    return { error: "กรุณาระบุวันที่เกิดเหตุให้ถูกต้อง" } as const;
  }
  if (!location) {
    return { error: "กรุณาระบุสถานที่เกิดเหตุ" } as const;
  }
  if (!SEVERITIES.includes(severity)) {
    return { error: "กรุณาเลือกระดับความรุนแรง" } as const;
  }
  if (!STATUSES.includes(status)) {
    return { error: "กรุณาเลือกสถานะ" } as const;
  }
  if (!description) {
    return { error: "กรุณาระบุรายละเอียดเหตุการณ์" } as const;
  }

  return {
    date: new Date(date),
    location,
    severity,
    status,
    injuredCount: Number.isFinite(injuredCount) ? Math.max(0, injuredCount) : 0,
    description,
    correctiveAction: correctiveAction || null,
  } as const;
}

export async function createAccidentReport(_state: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = parseCommon(formData);
  if ("error" in parsed) return parsed;

  await prisma.accidentReport.create({
    data: { ...parsed, createdById: admin.id },
  });

  revalidatePath("/accidents");
  redirect("/accidents");
}

export async function updateAccidentReport(
  id: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseCommon(formData);
  if ("error" in parsed) return parsed;

  await prisma.accidentReport.update({ where: { id }, data: parsed });

  revalidatePath("/accidents");
  redirect("/accidents");
}

export async function deleteAccidentReport(id: string) {
  await requireAdmin();
  await prisma.accidentReport.delete({ where: { id } });
  revalidatePath("/accidents");
}
