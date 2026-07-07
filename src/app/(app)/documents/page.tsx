import Link from "next/link";
import { requireModuleAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { deleteDocument } from "@/app/actions/documents";

export default async function DocumentsPage() {
  const user = await requireModuleAccess("documents");
  const isAdmin = user.role === "ADMIN";

  const documents = await prisma.document.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="เอกสาร"
        description="คลังเอกสาร นโยบาย และแบบฟอร์มของแผนก ST"
        action={
          isAdmin && (
            <Link
              href="/documents/new"
              className="btn-gradient rounded-2xl px-5 py-2.5 text-sm font-bold"
            >
              + เพิ่มเอกสาร
            </Link>
          )
        }
      />

      {documents.length === 0 ? (
        <EmptyState message="ยังไม่มีเอกสารในระบบ" />
      ) : (
        <div className="overflow-hidden rounded-3xl glass-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/60 dark:bg-slate-900/40 text-[10px] uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อเอกสาร</th>
                <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                <th className="px-4 py-3 font-medium">อัปเดตล่าสุด</th>
                {isAdmin && <th className="px-4 py-3 font-medium" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700/50">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 dark:text-white hover:text-indigo-500 hover:underline"
                    >
                      {doc.title}
                    </a>
                    {doc.description && (
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{doc.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-500">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {doc.updatedAt.toLocaleDateString("th-TH")}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/documents/${doc.id}/edit`}
                          className="rounded-xl px-3 py-1.5 text-sm font-semibold text-indigo-500 transition-colors hover:bg-indigo-500/10"
                        >
                          แก้ไข
                        </Link>
                        <ConfirmDeleteButton
                          action={deleteDocument.bind(null, doc.id)}
                          confirmMessage={`ลบเอกสาร "${doc.title}" ใช่หรือไม่?`}
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
