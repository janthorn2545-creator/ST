import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { ExternalSystemForm } from "@/components/external/ExternalSystemForm";
import { updateExternalSystem } from "@/app/actions/external-systems";

export default async function EditExternalSystemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const system = await prisma.externalSystem.findUnique({ where: { id } });
  if (!system) notFound();

  return (
    <div>
      <PageHeader title={`แก้ไขระบบ: ${system.name}`} />
      <ExternalSystemForm
        action={updateExternalSystem.bind(null, id)}
        initial={system}
        submitLabel="บันทึกการแก้ไข"
      />
    </div>
  );
}
