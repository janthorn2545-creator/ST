import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getVisibleModuleKeys, MODULE_META } from "@/lib/modules";
import { StatCard } from "@/components/StatCard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const visibleKeys = await getVisibleModuleKeys(user.role);

  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [documentCount, openAccidents, accidentsThisMonth, expiringMeds, externalCount] =
    await Promise.all([
      visibleKeys.has("documents") ? prisma.document.count() : null,
      visibleKeys.has("accidents")
        ? prisma.accidentReport.count({ where: { status: { not: "CLOSED" } } })
        : null,
      visibleKeys.has("accidents")
        ? prisma.accidentReport.count({ where: { date: { gte: startOfMonth } } })
        : null,
      visibleKeys.has("medications")
        ? prisma.medication.count({
            where: { expiryDate: { not: null, lte: in30Days } },
          })
        : null,
      visibleKeys.has("external") ? prisma.externalSystem.count() : null,
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          สวัสดี, {user.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          ภาพรวมข้อมูลของแผนก ST (Safety) วันนี้
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleKeys.has("documents") && (
          <StatCard label="เอกสารทั้งหมด" value={documentCount ?? 0} hint="ฉบับ" />
        )}
        {visibleKeys.has("accidents") && (
          <StatCard
            label="อุบัติเหตุที่ยังไม่ปิดเคส"
            value={openAccidents ?? 0}
            hint={`เดือนนี้ ${accidentsThisMonth ?? 0} รายการ`}
            tone={(openAccidents ?? 0) > 0 ? "danger" : "success"}
          />
        )}
        {visibleKeys.has("medications") && (
          <StatCard
            label="ยาใกล้หมดอายุ"
            value={expiringMeds ?? 0}
            hint="ภายใน 30 วัน"
            tone={(expiringMeds ?? 0) > 0 ? "warning" : "success"}
          />
        )}
        {visibleKeys.has("external") && (
          <StatCard label="ระบบภายนอกที่เชื่อมโยง" value={externalCount ?? 0} hint="ระบบ" />
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          ทางลัด
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(MODULE_META)
            .filter(([key]) => visibleKeys.has(key as keyof typeof MODULE_META))
            .map(([key, meta]) => (
              <Link
                key={key}
                href={meta.href}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
              >
                <p className="font-medium text-slate-900">{meta.label}</p>
                <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
              </Link>
            ))}
        </div>
        {visibleKeys.size === 0 && (
          <p className="text-sm text-slate-500">
            ยังไม่มีข้อมูลที่เปิดให้เข้าถึงในขณะนี้ กรุณาติดต่อผู้ดูแลระบบ
          </p>
        )}
      </div>
    </div>
  );
}
