import "server-only";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

/** Saves an uploaded file under public/uploads/<folder> and returns its public URL path. */
export async function saveUploadedFile(file: File, folder: string) {
  const dir = path.join(UPLOAD_ROOT, folder);
  await fs.mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}
