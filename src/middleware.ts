import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("next-auth.session-token")?.value;
  const url = req.nextUrl;

  try {
    const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Prevent infinite redirect loop by allowing access to login page
    if (url.pathname === "/login") {
      return NextResponse.next();
    }

    // Redirect if session token or JWT token is missing
    if (!sessionToken || !token) {
      console.warn("No session found, redirecting to login...");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based access control
    const userUnauthorizedRoutes = ["/invoices"];
    if (userUnauthorizedRoutes.includes(url.pathname) && token.role === "user") {
      console.warn(`Unauthorized access attempt to ${url.pathname}`);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/", "/invoices", "/customers", "/settings", "/unauthorized", "/account", "/todo"],
};
