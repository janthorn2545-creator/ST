import { notFound } from "next/navigation";
import { requireModuleAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";

export default async function ExternalSystemViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireModuleAccess("external");
  const { id } = await params;

  const system = await prisma.externalSystem.findUnique({ where: { id } });
  if (!system) notFound();

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={system.name} description={system.description ?? undefined} />
      <div className="min-h-[70vh] flex-1 overflow-hidden rounded-3xl glass-card">
        <iframe
          src={system.url}
          title={system.name}
          className="h-full min-h-[70vh] w-full"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}
