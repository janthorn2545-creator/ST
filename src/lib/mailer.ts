import "server-only";
import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER / GMAIL_APP_PASSWORD environment variables are not set",
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"ST Safety Dashboard" <${process.env.GMAIL_USER}>`,
    to,
    subject: "ตั้งรหัสผ่านใหม่ - ST Safety Dashboard",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>ตั้งรหัสผ่านใหม่</h2>
        <p>มีคำขอตั้งรหัสผ่านใหม่สำหรับบัญชีนี้ในระบบ ST Safety Dashboard</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">
            ตั้งรหัสผ่านใหม่
          </a>
        </p>
        <p>ลิงก์นี้จะหมดอายุภายใน 1 ชั่วโมง หากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้</p>
      </div>
    `,
  });
}
