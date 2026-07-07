"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export type FormState = { error?: string } | undefined;

function parseCommon(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const unit = String(formData.get("unit") || "").trim();
  const quantity = Number(formData.get("quantity") || 0);
  const minStock = Number(formData.get("minStock") || 0);
  const location = String(formData.get("location") || "").trim();
  const expiryDateRaw = String(formData.get("expiryDate") || "");
  const note = String(formData.get("note") || "").trim();

  if (!name || !category || !unit) {
    return { error: "กรุณากรอกชื่อยา หมวดหมู่ และหน่วยนับ" } as const;
  }
  if (!Number.isFinite(quantity) || quantity < 0) {
    return { error: "กรุณาระบุจำนวนคงเหลือให้ถูกต้อง" } as const;
  }

  return {
    name,
    category,
    unit,
    quantity: Math.trunc(quantity),
    minStock: Number.isFinite(minStock) ? Math.max(0, Math.trunc(minStock)) : 0,
    location: location || null,
    expiryDate: expiryDateRaw && !Number.isNaN(Date.parse(expiryDateRaw)) ? new Date(expiryDateRaw) : null,
    note: note || null,
  } as const;
}

export async function createMedication(_state: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = parseCommon(formData);
  if ("error" in parsed) return parsed;

  await prisma.medication.create({ data: { ...parsed, createdById: admin.id } });

  revalidatePath("/medications");
  redirect("/medications");
}

export async function updateMedication(
  id: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseCommon(formData);
  if ("error" in parsed) return parsed;

  await prisma.medication.update({ where: { id }, data: parsed });

  revalidatePath("/medications");
  redirect("/medications");
}

export async function deleteMedication(id: string) {
  await requireAdmin();
  await prisma.medication.delete({ where: { id } });
  revalidatePath("/medications");
}
