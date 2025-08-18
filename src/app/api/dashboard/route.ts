import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const { searchParams } = new URL(req.url);
    const statisticPeriod = searchParams.get("statisticPeriod") ?? "7";
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "999";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/User/dashboard?statisticPeriod=${statisticPeriod}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch dashboard", error: log },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/dashboard error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
