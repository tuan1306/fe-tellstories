import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type RawJwtPayload = {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
};

// allowed paths for mods
const moderatorAllowed = [
  "/moderator/stories",
  "/moderator/issue-management",
  "/moderator/write-story",
];

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  // Restrict access if other roles
  if (
    (request.nextUrl.pathname.startsWith("/owner") ||
      request.nextUrl.pathname.startsWith("/moderator")) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const decoded = jwtDecode<RawJwtPayload>(token);
    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Redirect after login
    if (request.nextUrl.pathname === "/login") {
      if (role === "Admin") {
        return NextResponse.redirect(new URL("/owner/dashboard", request.url));
      }
      if (role === "Moderator") {
        return NextResponse.redirect(
          new URL("/moderator/stories", request.url)
        );
      }
    }

    // Owner access check
    if (request.nextUrl.pathname.startsWith("/owner") && role !== "Admin") {
      return NextResponse.redirect(new URL("/moderator/stories", request.url));
    }

    // Moderator access check
    if (request.nextUrl.pathname.startsWith("/moderator")) {
      if (role !== "Moderator") {
        return NextResponse.redirect(new URL("/owner/dashboard", request.url));
      }
      if (!moderatorAllowed.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(
          new URL("/moderator/stories", request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/moderator/:path*", "/login"],
};
