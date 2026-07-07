import { requireAdmin } from "@/lib/dal";
import { PageHeader } from "@/components/PageHeader";
import { MedicationForm } from "@/components/medications/MedicationForm";
import { createMedication } from "@/app/actions/medications";

export default async function NewMedicationPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader title="เพิ่มรายการยาใหม่" />
      <MedicationForm action={createMedication} submitLabel="บันทึกรายการยา" />
    </div>
  );
}
