"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { EmbedMode } from "@/generated/prisma/client";

export type FormState = { error?: string } | undefined;

function parseCommon(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const embedMode = String(formData.get("embedMode") || "LINK") as EmbedMode;
  const order = Number(formData.get("order") || 0);

  if (!name) return { error: "กรุณาระบุชื่อระบบ" } as const;
  if (!url || !/^https?:\/\//i.test(url)) {
    return { error: "กรุณาระบุ URL ที่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)" } as const;
  }
  if (!["LINK", "IFRAME"].includes(embedMode)) {
    return { error: "รูปแบบการแสดงผลไม่ถูกต้อง" } as const;
  }

  return {
    name,
    description: description || null,
    url,
    embedMode,
    order: Number.isFinite(order) ? Math.trunc(order) : 0,
  } as const;
}

export async function createExternalSystem(_state: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = parseCommon(formData);
  if ("error" in parsed) return parsed;

  await prisma.externalSystem.create({ data: { ...parsed, createdById: admin.id } });

  revalidatePath("/external");
  redirect("/external");
}

export async function updateExternalSystem(
  id: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseCommon(formData);
  if ("error" in parsed) return parsed;

  await prisma.externalSystem.update({ where: { id }, data: parsed });

  revalidatePath("/external");
  redirect("/external");
}

export async function deleteExternalSystem(id: string) {
  await requireAdmin();
  await prisma.externalSystem.delete({ where: { id } });
  revalidatePath("/external");
}
