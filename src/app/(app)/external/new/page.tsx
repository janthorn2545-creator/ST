import { requireAdmin } from "@/lib/dal";
import { PageHeader } from "@/components/PageHeader";
import { ExternalSystemForm } from "@/components/external/ExternalSystemForm";
import { createExternalSystem } from "@/app/actions/external-systems";

export default async function NewExternalSystemPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader title="เพิ่มระบบภายนอก" />
      <ExternalSystemForm action={createExternalSystem} submitLabel="บันทึกระบบ" />
    </div>
  );
}
