"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

export type FormState = { error?: string } | undefined;

export async function createUser(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "EMPLOYEE") as Role;

  if (!name || !email || !password) {
    return { error: "กรุณากรอกชื่อ อีเมล และรหัสผ่าน" };
  }
  if (password.length < 8) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" };
  }
  if (!["ADMIN", "EMPLOYEE"].includes(role)) {
    return { error: "สิทธิ์ผู้ใช้งานไม่ถูกต้อง" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "มีผู้ใช้งานที่ใช้อีเมลนี้อยู่แล้ว" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash, role } });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(id: string, formData: FormData) {
  const admin = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "EMPLOYEE") as Role;
  const active = formData.get("active") === "on";

  if (!name) return;

  const isSelf = id === admin.id;

  await prisma.user.update({
    where: { id },
    data: {
      name,
      // Prevent an admin from locking themselves out.
      role: isSelf ? undefined : role,
      active: isSelf ? undefined : active,
    },
  });

  revalidatePath("/admin/users");
}

export async function resetUserPassword(id: string, formData: FormData) {
  await requireAdmin();

  const password = String(formData.get("password") || "");
  if (password.length < 8) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id }, data: { passwordHash } });

  revalidatePath("/admin/users");
}
