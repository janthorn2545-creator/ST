import { requireAdmin } from "@/lib/dal";
import { PageHeader } from "@/components/PageHeader";
import { AccidentForm } from "@/components/accidents/AccidentForm";
import { createAccidentReport } from "@/app/actions/accidents";

export default async function NewAccidentPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader title="บันทึกอุบัติเหตุใหม่" />
      <AccidentForm action={createAccidentReport} submitLabel="บันทึกรายงาน" />
    </div>
  );
}
