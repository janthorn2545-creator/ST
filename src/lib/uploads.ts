import "server-only";
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

/** Uploads a file to Vercel Blob storage under <folder>/ and returns its public URL. */
export async function saveUploadedFile(file: File, folder: string) {
  const filename = `${folder}/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}
