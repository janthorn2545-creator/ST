# ST Safety Dashboard

เว็บแอปรวมข้อมูลของแผนก ST (Safety) ในที่เดียว: เอกสาร, สรุปอุบัติเหตุ, รายการยา,
และลิงก์ไปยังระบบภายนอกของแผนก พร้อมระบบล็อกอินแยกสิทธิ์แอดมิน/พนักงาน

## สแตกที่ใช้

- Next.js 16 (App Router, Server Actions)
- Prisma ORM + PostgreSQL (เช่น [Neon](https://neon.tech) — มีแผนฟรี)
- ไฟล์อัปโหลดเก็บบน [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (มีแผนฟรี)
- Session แบบ JWT ใน httpOnly cookie (เซ็นด้วย `jose`), รหัสผ่านแฮชด้วย `bcryptjs`
- อีเมล (ลืมรหัสผ่าน) ส่งผ่าน Gmail SMTP (ด้วย `nodemailer`)
- Tailwind CSS

## เริ่มต้นใช้งาน (รันในเครื่อง)

1. ติดตั้ง dependencies:

   ```bash
   npm install
   ```

2. สร้างไฟล์ `.env` (คัดลอกจาก `.env.example`) แล้วกำหนดค่าต่างๆ:

   ```bash
   cp .env.example .env
   openssl rand -base64 32   # ใส่ผลลัพธ์ลงใน SESSION_SECRET
   ```

   - `DATABASE_URL`: connection string ของฐานข้อมูล Postgres (จาก Neon หรือ Postgres อื่น)
   - `GMAIL_USER` / `GMAIL_APP_PASSWORD`: สำหรับส่งอีเมลลืมรหัสผ่าน (ดูวิธีสร้าง App Password ด้านล่าง)
   - `BLOB_READ_WRITE_TOKEN`: token จาก Vercel Blob store สำหรับอัปโหลดไฟล์เอกสาร

3. สร้างตารางในฐานข้อมูล:

   ```bash
   npx prisma migrate deploy
   ```

4. สร้างผู้ใช้แอดมินเริ่มต้นและโมดูลเริ่มต้น:

   ```bash
   npm run seed
   ```

   ค่าเริ่มต้น: อีเมล `admin@st.local` / รหัสผ่าน `ChangeMe123!` (ตั้งค่า `SEED_ADMIN_EMAIL` /
   `SEED_ADMIN_PASSWORD` ใน `.env` ก่อนรันเพื่อเปลี่ยนได้) — **ควรเปลี่ยนรหัสผ่านทันทีหลังเข้าใช้งานครั้งแรก**

5. รันเซิร์ฟเวอร์สำหรับพัฒนา:

   ```bash
   npm run dev
   ```

   หรือสำหรับ production:

   ```bash
   npm run build
   npm run start
   ```

## Deploy ขึ้น Vercel (ใช้งานได้ตลอด 24 ชม. ผ่านอินเทอร์เน็ต)

1. สร้างฐานข้อมูลฟรีที่ [neon.tech](https://neon.tech) แล้วคัดลอก connection string มาใส่ `DATABASE_URL`
2. สร้างโปรเจกต์บน [vercel.com](https://vercel.com) โดยเชื่อมกับ repo GitHub นี้ (branch `claude/st-department-dashboard-a695yh`)
3. เปิดใช้งาน Blob store ในแท็บ "Storage" ของโปรเจกต์บน Vercel แล้วคัดลอก `BLOB_READ_WRITE_TOKEN` มาใส่
4. ใส่ตัวแปรสภาพแวดล้อมทั้งหมด (เหมือนใน `.env`) ในหน้า Settings → Environment Variables ของ Vercel
5. Deploy แล้วรัน `npx prisma migrate deploy` และ `npm run seed` อีกครั้งโดยชี้ไปที่ฐานข้อมูล Neon (รันจากเครื่องตัวเอง โดยตั้ง `DATABASE_URL` ใน `.env` ให้เป็นของ Neon ชั่วคราว)

## ตั้งค่า Gmail App Password (สำหรับฟีเจอร์ลืมรหัสผ่าน)

1. เปิด 2-Step Verification ที่ https://myaccount.google.com/security
2. สร้าง App Password ที่ https://myaccount.google.com/apppasswords
3. นำรหัส 16 หลักที่ได้ไปใส่ใน `GMAIL_APP_PASSWORD`

## โครงสร้างสิทธิ์การใช้งาน

- **แอดมิน**: เข้าถึง/แก้ไขข้อมูลได้ทุกโมดูล และจัดการผู้ใช้งาน + เปิด/ปิดการมองเห็นข้อมูลของพนักงานได้ที่หน้า
  "ตั้งค่าระบบ" (`/admin`)
- **พนักงาน**: สมัครใช้งานเองได้ที่ `/signup`, เห็นเฉพาะโมดูลที่แอดมินเปิดให้ (ตั้งค่าที่ `/admin/modules`)
  และดูข้อมูลได้อย่างเดียว (read-only)

## โมดูลที่มีในเวอร์ชันนี้

- เอกสาร (`/documents`) — ลิงก์ไปยังเอกสารภายนอก หรืออัปโหลดไฟล์ (เก็บบน Vercel Blob)
- สรุปอุบัติเหตุ (`/accidents`) — สถิติรายเดือน + รายการอุบัติเหตุ
- รายการยา (`/medications`) — สต็อกยา พร้อมแจ้งเตือนใกล้หมดอายุ/ต่ำกว่าเกณฑ์
- ระบบภายนอก (`/external`) — ลิงก์หรือฝัง (iframe) เว็บแอปอื่นของแผนก

โครงสร้างฐานข้อมูลรองรับการเพิ่มโมดูลใหม่ในอนาคต (เช่น การตรวจผู้รับเหมา, การอบรม, 5ส,
สรุปค่าใช้จ่าย, การตรวจถังดับเพลิง) โดยเพิ่ม Prisma model + entry ใน `src/lib/modules.ts`
แล้วสร้างหน้าโมดูลใหม่ตามรูปแบบเดิม
