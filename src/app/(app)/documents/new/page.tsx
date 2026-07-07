import { requireAdmin } from "@/lib/dal";
import { PageHeader } from "@/components/PageHeader";
import { DocumentForm } from "@/components/documents/DocumentForm";
import { createDocument } from "@/app/actions/documents";

export default async function NewDocumentPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader title="เพิ่มเอกสารใหม่" />
      <DocumentForm action={createDocument} submitLabel="บันทึกเอกสาร" />
    </div>
  );
}
