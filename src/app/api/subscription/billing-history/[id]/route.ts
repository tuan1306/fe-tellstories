import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const userId = (await params).id;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/User/billing-history/${userId}`,
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
        { message: "Failed to get billing history", error },
        { status: res.status }
      );
    }

    const data = await res.json();
    // console.log(
    //   "[BillingHistory API] Retrieved data:",
    //   JSON.stringify(data, null, 2)
    // );

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/users/[id]/billing error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
