import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;

  return (
    <AuthShell
      title="ระบบข้อมูลแผนก ST"
      subtitle="เข้าสู่ระบบเพื่อใช้งานข้อมูลความปลอดภัยของแผนก"
    >
      <LoginForm resetSuccess={reset === "success"} />
    </AuthShell>
  );
}
