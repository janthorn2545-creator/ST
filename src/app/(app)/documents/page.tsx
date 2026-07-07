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
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              + เพิ่มเอกสาร
            </Link>
          )
        }
      />

      {documents.length === 0 ? (
        <EmptyState message="ยังไม่มีเอกสารในระบบ" />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อเอกสาร</th>
                <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                <th className="px-4 py-3 font-medium">อัปเดตล่าสุด</th>
                {isAdmin && <th className="px-4 py-3 font-medium" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-900 hover:text-amber-600 hover:underline"
                    >
                      {doc.title}
                    </a>
                    {doc.description && (
                      <p className="mt-0.5 text-xs text-slate-500">{doc.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {doc.updatedAt.toLocaleDateString("th-TH")}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/documents/${doc.id}/edit`}
                          className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
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
