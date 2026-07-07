import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "ผู้ดูแลระบบ",
  EMPLOYEE: "พนักงาน",
};

export default async function AdminUsersPage() {
  const admin = await requireAdmin();

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <PageHeader
        title="จัดการผู้ใช้งาน"
        description="เพิ่มผู้ใช้ใหม่และกำหนดสิทธิ์แอดมินหรือพนักงาน"
        action={
          <Link
            href="/admin/users/new"
            className="btn-gradient rounded-2xl px-5 py-2.5 text-sm font-bold"
          >
            + เพิ่มผู้ใช้งาน
          </Link>
        }
      />

      <div className="overflow-hidden rounded-3xl glass-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/60 dark:bg-slate-900/40 text-[10px] uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">ชื่อ</th>
              <th className="px-4 py-3 font-medium">อีเมล</th>
              <th className="px-4 py-3 font-medium">สิทธิ์</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700/50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  {u.name}
                  {u.id === admin.id && (
                    <span className="ml-2 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-normal text-slate-500 dark:text-slate-400">
                      คุณ
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{ROLE_LABEL[u.role] ?? u.role}</td>
                <td className="px-4 py-3">
                  {u.active ? (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                      ใช้งานอยู่
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      ปิดการใช้งาน
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/users/${u.id}/edit`}
                    className="rounded-xl px-3 py-1.5 text-sm font-semibold text-indigo-500 transition-colors hover:bg-indigo-500/10"
                  >
                    แก้ไข
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
