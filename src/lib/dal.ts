import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionPayload } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { isModuleVisible, type ModuleKey } from "@/lib/modules";

export const verifySession = cache(async () => {
  const session = await getSessionPayload();
  if (!session?.userId) {
    redirect("/login");
  }
  return session;
});

export const getOptionalSession = cache(async () => {
  return getSessionPayload();
});

export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
  });

  if (!user || !user.active) {
    redirect("/login");
  }

  return user;
});

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return user;
}

/** Ensures the current user may view the given module; redirects home otherwise. */
export async function requireModuleAccess(key: ModuleKey) {
  const user = await getCurrentUser();
  const visible = await isModuleVisible(key, user.role);
  if (!visible) {
    redirect("/dashboard");
  }
  return user;
}
