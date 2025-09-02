import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const token = (await cookies()).get("authToken")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/User/change-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("Backend /User/change-password PATCH failed:", error);
      return NextResponse.json(
        { message: "Unable to change password", error },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("PATCH - /api/User/change-password error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
