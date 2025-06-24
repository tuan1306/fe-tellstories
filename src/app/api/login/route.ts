"use server";

import { logInSchema } from "@/utils/validators/schemas";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RawJwtPayload = {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
};

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();
    const parsed = logInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid Input", status: 400 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      }
    );

    // Validate response
    const responseJson = await res.json();
    if (!res.ok || !responseJson.data) {
      const message =
        typeof responseJson.message === "string"
          ? responseJson.message
          : "Login failed";
      return NextResponse.json({ message }, { status: 401 });
    }

    // Validate role
    const token = responseJson.data;
    const decoded = jwtDecode<RawJwtPayload>(token);
    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role !== "Admin") {
      return NextResponse.json(
        { message: "Unauthorized role" },
        { status: 403 }
      );
    }

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    cookieStore.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("Something wrong on the login API: ", err);
    throw err;
  }
}
