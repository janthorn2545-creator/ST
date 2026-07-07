import "server-only";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

export const MODULE_KEYS = [
  "documents",
  "accidents",
  "medications",
  "external",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];

export const MODULE_META: Record<
  ModuleKey,
  { label: string; href: string; description: string }
> = {
  documents: {
    label: "เอกสาร",
    href: "/documents",
    description: "คลังเอกสารแผนก ST",
  },
  accidents: {
    label: "สรุปอุบัติเหตุ",
    href: "/accidents",
    description: "สถิติและรายงานอุบัติเหตุ",
  },
  medications: {
    label: "รายการยา",
    href: "/medications",
    description: "รายการยาและเวชภัณฑ์",
  },
  external: {
    label: "ระบบภายนอก",
    href: "/external",
    description: "ลิงก์ไปยังระบบ/เว็บแอปอื่นของแผนก",
  },
};

/** Returns the set of module keys visible to the given role. Admins always see everything. */
export async function getVisibleModuleKeys(role: Role): Promise<Set<ModuleKey>> {
  if (role === "ADMIN") {
    return new Set(MODULE_KEYS);
  }

  const modules = await prisma.module.findMany({
    where: { visibleToEmployee: true },
    select: { key: true },
  });

  const visible = new Set<ModuleKey>();
  for (const m of modules) {
    if ((MODULE_KEYS as readonly string[]).includes(m.key)) {
      visible.add(m.key as ModuleKey);
    }
  }
  return visible;
}

export async function isModuleVisible(key: ModuleKey, role: Role) {
  if (role === "ADMIN") return true;
  const mod = await prisma.module.findUnique({ where: { key } });
  return mod?.visibleToEmployee ?? false;
}
