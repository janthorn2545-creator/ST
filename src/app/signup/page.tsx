import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell title="สมัครใช้งาน" subtitle="สร้างบัญชีพนักงานสำหรับระบบข้อมูลแผนก ST">
      <SignupForm />
    </AuthShell>
  );
}
