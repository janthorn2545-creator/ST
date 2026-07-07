import Link from "next/link";
import { requireModuleAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/StatCard";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { deleteMedication } from "@/app/actions/medications";

function expiryTone(expiryDate: Date | null, now: Date) {
  if (!expiryDate) return { label: "-", className: "text-slate-500" };
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = expiryDate.toLocaleDateString("th-TH");
  if (daysLeft < 0) {
    return { label: `${formatted} (หมดอายุแล้ว)`, className: "font-medium text-red-600" };
  }
  if (daysLeft <= 30) {
    return { label: `${formatted} (อีก ${daysLeft} วัน)`, className: "font-medium text-amber-600" };
  }
  return { label: formatted, className: "text-slate-600" };
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
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
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
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อยา</th>
                <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                <th className="px-4 py-3 font-medium">คงเหลือ</th>
                <th className="px-4 py-3 font-medium">ที่จัดเก็บ</th>
                <th className="px-4 py-3 font-medium">วันหมดอายุ</th>
                {isAdmin && <th className="px-4 py-3 font-medium" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medications.map((m) => {
                const expiry = expiryTone(m.expiryDate, now);
                const lowStockRow = m.quantity <= m.minStock;
                return (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{m.name}</p>
                      {m.note && <p className="mt-0.5 text-xs text-slate-500">{m.note}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {m.category}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${lowStockRow ? "font-medium text-red-600" : "text-slate-600"}`}>
                      {m.quantity} {m.unit}
                      {lowStockRow && <span className="ml-1 text-xs">(ต่ำกว่าเกณฑ์ {m.minStock})</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{m.location ?? "-"}</td>
                    <td className={`px-4 py-3 ${expiry.className}`}>{expiry.label}</td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/medications/${m.id}/edit`}
                            className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
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
