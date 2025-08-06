import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/User/get-subscription-detail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        {
          message: "Failed to fetch user subscription detail",
          error: log,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    console.log("Fetched subscription detail for user:", id, data);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/subscription/user/[userId]:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
