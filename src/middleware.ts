import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {

const sessionToken = request.cookies.get('next-auth.session-token')?.value;

  // Redirect if no token found
  if (!sessionToken ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/", "/invoices", "/customers", "/settings"]
};
