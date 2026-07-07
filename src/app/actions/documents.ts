"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/uploads";

export type FormState = { error?: string } | undefined;

async function resolveUrl(formData: FormData): Promise<string | { error: string }> {
  const file = formData.get("file");
  const url = String(formData.get("url") || "").trim();

  if (file instanceof File && file.size > 0) {
    return saveUploadedFile(file, "documents");
  }
  if (url) {
    return url;
  }
  return { error: "กรุณาระบุลิงก์เอกสาร หรืออัปโหลดไฟล์" };
}

export async function createDocument(_state: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!title || !category) {
    return { error: "กรุณากรอกชื่อเอกสารและหมวดหมู่" };
  }

  const resolved = await resolveUrl(formData);
  if (typeof resolved !== "string") return resolved;

  await prisma.document.create({
    data: {
      title,
      category,
      description: description || null,
      url: resolved,
      createdById: admin.id,
    },
  });

  revalidatePath("/documents");
  redirect("/documents");
}

export async function updateDocument(
  id: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!title || !category) {
    return { error: "กรุณากรอกชื่อเอกสารและหมวดหมู่" };
  }

  const file = formData.get("file");
  const url = String(formData.get("url") || "").trim();
  let resolvedUrl: string | undefined;

  if (file instanceof File && file.size > 0) {
    resolvedUrl = await saveUploadedFile(file, "documents");
  } else if (url) {
    resolvedUrl = url;
  }

  await prisma.document.update({
    where: { id },
    data: {
      title,
      category,
      description: description || null,
      ...(resolvedUrl ? { url: resolvedUrl } : {}),
    },
  });

  revalidatePath("/documents");
  redirect("/documents");
}

export async function deleteDocument(id: string) {
  await requireAdmin();
  await prisma.document.delete({ where: { id } });
  revalidatePath("/documents");
}
