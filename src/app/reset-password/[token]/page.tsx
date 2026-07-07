import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <AuthShell title="ตั้งรหัสผ่านใหม่">
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
