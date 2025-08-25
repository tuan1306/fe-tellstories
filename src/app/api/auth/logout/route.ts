import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Since the cookie I set up was HTTP only, I need to clear it like this.
  // Normal document.cookie won't able to access.
  response.cookies.set("authToken", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
