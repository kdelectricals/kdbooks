import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("next-auth.session-token")?.value;
  const token: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // Redirect if no token found
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const { pathname } = req.nextUrl;

  const userUnauthorizedRoutes = ["/invoices"];

  if (userUnauthorizedRoutes.includes(pathname) && token.role === "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }


  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/", "/invoices", "/customers", "/settings", "/unauthorized", "/account", "/todo"],
};
