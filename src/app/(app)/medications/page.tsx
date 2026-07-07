import Link from "next/link";
import { requireModuleAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/StatCard";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { deleteMedication } from "@/app/actions/medications";

function expiryTone(expiryDate: Date | null, now: Date) {
  if (!expiryDate) return { label: "-", className: "text-slate-500 dark:text-slate-400" };
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = expiryDate.toLocaleDateString("th-TH");
  if (daysLeft < 0) {
    return { label: `${formatted} (หมดอายุแล้ว)`, className: "font-semibold text-rose-500" };
  }
  if (daysLeft <= 30) {
    return { label: `${formatted} (อีก ${daysLeft} วัน)`, className: "font-semibold text-amber-500" };
  }
  return { label: formatted, className: "text-slate-600 dark:text-slate-300" };
}

export default async function MedicationsPage() {
  const user = await requireModuleAccess("medications");
  const isAdmin = user.role === "ADMIN";

  const now = new Date();
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);

  const medications = await prisma.medication.findMany({
    orderBy: [{ expiryDate: "asc" }, { name: "asc" }],
  });

  const expiringSoon = medications.filter(
    (m) => m.expiryDate && m.expiryDate <= in30Days,
  ).length;
  const lowStock = medications.filter((m) => m.quantity <= m.minStock).length;

  return (
    <div>
      <PageHeader
        title="รายการยา"
        description="รายการยาและเวชภัณฑ์ของแผนก ST"
        action={
          isAdmin && (
            <Link
              href="/medications/new"
              className="btn-gradient rounded-2xl px-5 py-2.5 text-sm font-bold"
            >
              + เพิ่มรายการยา
            </Link>
          )
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="รายการยาทั้งหมด" value={medications.length} hint="รายการ" />
        <StatCard
          label="ใกล้หมดอายุ / หมดอายุแล้ว"
          value={expiringSoon}
          tone={expiringSoon > 0 ? "warning" : "success"}
          hint="ภายใน 30 วัน"
        />
        <StatCard
          label="สต็อกต่ำกว่าเกณฑ์"
          value={lowStock}
          tone={lowStock > 0 ? "danger" : "success"}
        />
      </div>

      {medications.length === 0 ? (
        <EmptyState message="ยังไม่มีรายการยาในระบบ" />
      ) : (
        <div className="overflow-hidden rounded-3xl glass-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/60 dark:bg-slate-900/40 text-[10px] uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อยา</th>
                <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                <th className="px-4 py-3 font-medium">คงเหลือ</th>
                <th className="px-4 py-3 font-medium">ที่จัดเก็บ</th>
                <th className="px-4 py-3 font-medium">วันหมดอายุ</th>
                {isAdmin && <th className="px-4 py-3 font-medium" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700/50">
              {medications.map((m) => {
                const expiry = expiryTone(m.expiryDate, now);
                const lowStockRow = m.quantity <= m.minStock;
                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">{m.name}</p>
                      {m.note && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{m.note}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-500">
                        {m.category}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${lowStockRow ? "font-semibold text-rose-500" : "text-slate-600 dark:text-slate-300"}`}>
                      {m.quantity} {m.unit}
                      {lowStockRow && <span className="ml-1 text-xs">(ต่ำกว่าเกณฑ์ {m.minStock})</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.location ?? "-"}</td>
                    <td className={`px-4 py-3 ${expiry.className}`}>{expiry.label}</td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/medications/${m.id}/edit`}
                            className="rounded-xl px-3 py-1.5 text-sm font-semibold text-indigo-500 transition-colors hover:bg-indigo-500/10"
                          >
                            แก้ไข
                          </Link>
                          <ConfirmDeleteButton
                            action={deleteMedication.bind(null, m.id)}
                            confirmMessage={`ลบรายการยา "${m.name}" ใช่หรือไม่?`}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
