import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "subscribers";
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "10";

    const endpointMap: Record<string, string> = {
      subscribers: "dashboard-get-subscribers",
      new: "dashboard-get-new-subscribers",
      quit: "dashboard-get-quit-subscribers",
    };

    const endpoint = endpointMap[type] || endpointMap.subscribers;

    const queryParams = new URLSearchParams({ page, pageSize });

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/Subscription/${endpoint}?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch subscriber list", error: log },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/Subscription/subscriber-list response:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
