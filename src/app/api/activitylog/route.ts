import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const param = await params;
    const userId = await param.id;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/ActivityLog/user-id/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { message: "Failed to get user", error },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/users/[id] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
