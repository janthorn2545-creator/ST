import { requireAdmin } from "@/lib/dal";
import { PageHeader } from "@/components/PageHeader";
import { NewUserForm } from "@/components/admin/NewUserForm";

export default async function NewUserPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader title="เพิ่มผู้ใช้งานใหม่" />
      <NewUserForm />
    </div>
  );
}
