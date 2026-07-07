import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: path.join(process.cwd(), "dev.db"),
});
const prisma = new PrismaClient({ adapter });

const DEFAULT_MODULES = [
  { key: "documents", label: "เอกสาร", description: "คลังเอกสารแผนก ST", order: 1 },
  { key: "accidents", label: "สรุปอุบัติเหตุ", description: "สถิติและรายงานอุบัติเหตุ", order: 2 },
  { key: "medications", label: "รายการยา", description: "รายการยาและเวชภัณฑ์", order: 3 },
  { key: "external", label: "ระบบภายนอก", description: "ลิงก์/ระบบอื่นที่เกี่ยวข้องกับแผนก", order: 4 },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@st.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "ST Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  for (const mod of DEFAULT_MODULES) {
    await prisma.module.upsert({
      where: { key: mod.key },
      update: {},
      create: mod,
    });
  }
  console.log("Modules seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
