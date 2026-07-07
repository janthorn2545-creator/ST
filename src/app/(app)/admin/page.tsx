import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [userCount, activeCount, moduleCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { active: true } }),
    prisma.module.count({ where: { visibleToEmployee: true } }),
  ]);

  return (
    <div>
      <PageHeader
        title="ตั้งค่าระบบ"
        description="จัดการผู้ใช้งานและสิทธิ์การเข้าถึงข้อมูลของแผนก"
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="ผู้ใช้งานทั้งหมด" value={userCount} />
        <StatCard label="ผู้ใช้งานที่ใช้งานอยู่" value={activeCount} tone="success" />
        <StatCard label="ข้อมูลที่เปิดให้พนักงานเห็น" value={moduleCount} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/users"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
        >
          <p className="font-medium text-slate-900">จัดการผู้ใช้งาน</p>
          <p className="mt-1 text-sm text-slate-500">
            เพิ่ม/แก้ไขผู้ใช้ กำหนดสิทธิ์แอดมินหรือพนักงาน และรีเซ็ตรหัสผ่าน
          </p>
        </Link>
        <Link
          href="/admin/modules"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
        >
          <p className="font-medium text-slate-900">เปิด/ปิดข้อมูลสำหรับพนักงาน</p>
          <p className="mt-1 text-sm text-slate-500">
            กำหนดว่าข้อมูลส่วนใดที่พนักงานทั่วไปสามารถเข้าถึงได้
          </p>
        </Link>
      </div>
    </div>
  );
}
