"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function setModuleVisibility(moduleId: string, visible: boolean) {
  await requireAdmin();
  await prisma.module.update({
    where: { id: moduleId },
    data: { visibleToEmployee: visible },
  });
  revalidatePath("/admin/modules");
  revalidatePath("/dashboard");
}
