import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { ModuleToggle } from "@/components/admin/ModuleToggle";
import { MODULE_KEYS, MODULE_META } from "@/lib/modules";

export default async function AdminModulesPage() {
  await requireAdmin();

  const modules = await prisma.module.findMany({ orderBy: { order: "asc" } });
  const byKey = new Map(modules.map((m) => [m.key, m]));

  return (
    <div>
      <PageHeader
        title="เปิด/ปิดข้อมูลสำหรับพนักงาน"
        description="แอดมินจะเห็นข้อมูลทุกส่วนเสมอ สวิตช์นี้ควบคุมสิทธิ์การเข้าถึงของพนักงานทั่วไปเท่านั้น"
      />

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <ul className="divide-y divide-slate-100">
          {MODULE_KEYS.map((key) => {
            const mod = byKey.get(key);
            const meta = MODULE_META[key];
            if (!mod) return null;
            return (
              <li key={key} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="font-medium text-slate-900">{meta.label}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{meta.description}</p>
                </div>
                <ModuleToggle moduleId={mod.id} initialVisible={mod.visibleToEmployee} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
