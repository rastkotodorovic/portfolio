import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get the token (session) from the request
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
