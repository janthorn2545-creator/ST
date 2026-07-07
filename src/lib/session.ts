import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@/generated/prisma/client";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET environment variable is not set");
}
const encodedKey = new TextEncoder().encode(secretKey);

const SESSION_COOKIE = "st_session";
const REMEMBER_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_DURATION_MS = 24 * 60 * 60 * 1000;

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
  role: Role;
};

export async function encrypt(payload: SessionPayload, durationSeconds: number) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + durationSeconds)
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload & { iat: number; exp: number };
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload, remember = false) {
  const durationMs = remember ? REMEMBER_DURATION_MS : DEFAULT_DURATION_MS;
  const expiresAt = new Date(Date.now() + durationMs);
  const session = await encrypt(payload, durationMs / 1000);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Omitting `expires` for a non-remembered session makes it a browser-session
    // cookie that clears when the browser closes, while the JWT itself still
    // expires in 24h as a safety net.
    ...(remember ? { expires: expiresAt } : {}),
    sameSite: "lax",
    path: "/",
  });
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return decrypt(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export { SESSION_COOKIE };
