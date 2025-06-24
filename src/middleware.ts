import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken");

  if (request.nextUrl.pathname.startsWith("/owner") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/owner/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/login"],
};
