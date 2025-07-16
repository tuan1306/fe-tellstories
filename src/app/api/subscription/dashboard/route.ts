import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Subscription/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch subscription dashboard", error: log },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/Subscription/dashboard response:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
