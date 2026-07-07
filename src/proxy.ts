import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// Routes only relevant to logged-out visitors; redirect away if already authenticated.
const GUEST_ONLY_ROUTES = ["/login", "/signup", "/forgot-password"];
// Routes that should always be reachable regardless of auth state.
const PUBLIC_PREFIXES = ["/reset-password/"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(pathname);
  const isAlwaysPublicRoute = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const token = req.cookies.get("st_session")?.value;
  const session = await decrypt(token);

  if (!isGuestOnlyRoute && !isAlwaysPublicRoute && !session?.userId) {
    const loginUrl = new URL("/login", req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnlyRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
