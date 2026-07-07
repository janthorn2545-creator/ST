import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Field, TextInput, Select, FormActions, SubmitButton } from "@/components/form";
import { updateUser, resetUserPassword } from "@/app/actions/users";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  const isSelf = user.id === admin.id;

  return (
    <div className="space-y-10">
      <div>
        <PageHeader title={`แก้ไขผู้ใช้งาน: ${user.name}`} />

        <form action={updateUser.bind(null, user.id)} className="max-w-xl space-y-4">
          <Field label="ชื่อ-นามสกุล" htmlFor="name" required>
            <TextInput id="name" name="name" required defaultValue={user.name} />
          </Field>

          <Field label="อีเมล" htmlFor="email">
            <TextInput id="email" value={user.email} disabled className="opacity-60" />
          </Field>

          <Field label="สิทธิ์การใช้งาน" htmlFor="role">
            <Select id="role" name="role" defaultValue={user.role} disabled={isSelf}>
              <option value="EMPLOYEE">พนักงาน</option>
              <option value="ADMIN">ผู้ดูแลระบบ</option>
            </Select>
            {isSelf && (
              <p className="mt-1 text-xs text-slate-400">ไม่สามารถเปลี่ยนสิทธิ์ของตนเองได้</p>
            )}
          </Field>

          <div className="flex items-center gap-2">
            <input
              id="active"
              name="active"
              type="checkbox"
              defaultChecked={user.active}
              disabled={isSelf}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
            />
            <label htmlFor="active" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              เปิดใช้งานบัญชีนี้
            </label>
          </div>

          <FormActions>
            <SubmitButton pending={false} label="บันทึกการเปลี่ยนแปลง" pendingLabel="กำลังบันทึก..." />
          </FormActions>
        </form>
      </div>

      <div className="max-w-xl border-t border-slate-200 dark:border-slate-700/50 pt-8">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">รีเซ็ตรหัสผ่าน</h2>
        <form action={resetUserPassword.bind(null, user.id)} className="space-y-4">
          <Field label="รหัสผ่านใหม่" htmlFor="password" required>
            <TextInput id="password" name="password" type="password" required minLength={8} />
          </Field>
          <FormActions>
            <SubmitButton pending={false} label="รีเซ็ตรหัสผ่าน" pendingLabel="กำลังบันทึก..." />
          </FormActions>
        </form>
      </div>
    </div>
  );
}
