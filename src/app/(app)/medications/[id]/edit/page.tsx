import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { MedicationForm } from "@/components/medications/MedicationForm";
import { updateMedication } from "@/app/actions/medications";

export default async function EditMedicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const medication = await prisma.medication.findUnique({ where: { id } });
  if (!medication) notFound();

  return (
    <div>
      <PageHeader title={`แก้ไขรายการยา: ${medication.name}`} />
      <MedicationForm
        action={updateMedication.bind(null, id)}
        initial={medication}
        submitLabel="บันทึกการแก้ไข"
      />
    </div>
  );
}
