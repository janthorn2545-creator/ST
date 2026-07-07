import Link from "next/link";
import { requireModuleAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { deleteExternalSystem } from "@/app/actions/external-systems";

export default async function ExternalSystemsPage() {
  const user = await requireModuleAccess("external");
  const isAdmin = user.role === "ADMIN";

  const systems = await prisma.externalSystem.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <PageHeader
        title="ระบบภายนอก"
        description="ลิงก์ไปยังเว็บแอปและระบบอื่นที่แผนกใช้งานอยู่"
        action={
          isAdmin && (
            <Link
              href="/external/new"
              className="btn-gradient rounded-2xl px-5 py-2.5 text-sm font-bold"
            >
              + เพิ่มระบบ
            </Link>
          )
        }
      />

      {systems.length === 0 ? (
        <EmptyState message="ยังไม่มีระบบภายนอกที่เชื่อมโยงไว้" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((system) => {
            const href = system.embedMode === "IFRAME" ? `/external/${system.id}/view` : system.url;
            const isExternal = system.embedMode === "LINK";
            return (
              <div
                key={system.id}
                className="glass-card glass-card-hover flex flex-col justify-between rounded-3xl p-5"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{system.name}</p>
                  {system.description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{system.description}</p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-sm font-semibold text-indigo-500 hover:underline"
                  >
                    เปิดใช้งาน →
                  </a>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Link
                        href={`/external/${system.id}/edit`}
                        className="rounded-xl px-3 py-1.5 text-sm font-semibold text-indigo-500 transition-colors hover:bg-indigo-500/10"
                      >
                        แก้ไข
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteExternalSystem.bind(null, system.id)}
                        confirmMessage={`ลบระบบ "${system.name}" ใช่หรือไม่?`}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
