import Link from "next/link";
import { requireModuleAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { StatCard } from "@/components/StatCard";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { MonthlyBarChart } from "@/components/accidents/MonthlyBarChart";
import { SeverityBadge, AccidentStatusBadge } from "@/components/accidents/badges";
import { deleteAccidentReport } from "@/app/actions/accidents";

export default async function AccidentsPage() {
  const user = await requireModuleAccess("accidents");
  const isAdmin = user.role === "ADMIN";

  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const yearEnd = new Date(new Date().getFullYear() + 1, 0, 1);

  const [reports, thisYearReports] = await Promise.all([
    prisma.accidentReport.findMany({ orderBy: { date: "desc" } }),
    prisma.accidentReport.findMany({
      where: { date: { gte: yearStart, lt: yearEnd } },
      select: { date: true },
    }),
  ]);

  const totalThisYear = thisYearReports.length;
  const openCases = reports.filter((r) => r.status !== "CLOSED").length;
  const severeCases = reports.filter((r) => r.severity === "SEVERE").length;

  const monthlyCounts = Array(12).fill(0);
  for (const r of thisYearReports) {
    monthlyCounts[r.date.getMonth()] += 1;
  }

  return (
    <div>
      <PageHeader
        title="สรุปอุบัติเหตุ"
        description="สถิติและรายงานอุบัติเหตุของแผนก ST"
        action={
          isAdmin && (
            <Link
              href="/accidents/new"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              + บันทึกอุบัติเหตุ
            </Link>
          )
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="อุบัติเหตุปีนี้" value={totalThisYear} hint="รายการ" />
        <StatCard
          label="ยังไม่ปิดเคส"
          value={openCases}
          tone={openCases > 0 ? "danger" : "success"}
        />
        <StatCard
          label="ระดับรุนแรง"
          value={severeCases}
          tone={severeCases > 0 ? "warning" : "success"}
        />
      </div>

      <div className="mb-6">
        <MonthlyBarChart counts={monthlyCounts} />
      </div>

      {reports.length === 0 ? (
        <EmptyState message="ยังไม่มีรายงานอุบัติเหตุในระบบ" />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">วันที่</th>
                <th className="px-4 py-3 font-medium">สถานที่</th>
                <th className="px-4 py-3 font-medium">ความรุนแรง</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium">ผู้บาดเจ็บ</th>
                {isAdmin && <th className="px-4 py-3 font-medium" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <tr key={r.id} className="align-top hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {r.date.toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{r.location}</p>
                    <p className="mt-0.5 max-w-md text-xs text-slate-500">{r.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={r.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <AccidentStatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.injuredCount}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/accidents/${r.id}/edit`}
                          className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          แก้ไข
                        </Link>
                        <ConfirmDeleteButton
                          action={deleteAccidentReport.bind(null, r.id)}
                          confirmMessage="ลบรายงานอุบัติเหตุนี้ใช่หรือไม่?"
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
