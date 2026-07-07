import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { DocumentForm } from "@/components/documents/DocumentForm";
import { updateDocument } from "@/app/actions/documents";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) notFound();

  return (
    <div>
      <PageHeader title={`แก้ไขเอกสาร: ${document.title}`} />
      <DocumentForm
        action={updateDocument.bind(null, id)}
        initial={document}
        submitLabel="บันทึกการแก้ไข"
      />
    </div>
  );
}
