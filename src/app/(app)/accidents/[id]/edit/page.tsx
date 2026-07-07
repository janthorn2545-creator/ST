import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { AccidentForm } from "@/components/accidents/AccidentForm";
import { updateAccidentReport } from "@/app/actions/accidents";

export default async function EditAccidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const report = await prisma.accidentReport.findUnique({ where: { id } });
  if (!report) notFound();

  return (
    <div>
      <PageHeader title={`แก้ไขรายงานอุบัติเหตุ: ${report.location}`} />
      <AccidentForm
        action={updateAccidentReport.bind(null, id)}
        initial={report}
        submitLabel="บันทึกการแก้ไข"
      />
    </div>
  );
}
