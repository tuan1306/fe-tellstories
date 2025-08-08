import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "1";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Subscription/dashboard-get-recent-subscribers-within-period?period=${period}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch recent subscriber list", error: log },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/Subscription/recent-sub response:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
