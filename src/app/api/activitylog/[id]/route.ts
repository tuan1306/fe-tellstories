import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const userId = (await params).id;

    const { searchParams } = new URL(req.url);
    const getByDateFrom = searchParams.get("getByDateFrom") || "";
    const getByDateTo = searchParams.get("getByDateTo") || "";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "999";

    // console.log(
    //   `Fetching activity logs for user ${userId} | From: ${getByDateFrom} | To: ${getByDateTo}`
    // );

    const query = new URLSearchParams({
      ...(getByDateFrom && { getByDateFrom }),
      ...(getByDateTo && { getByDateTo }),
      page,
      pageSize,
    });

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/ActivityLog/user-id/${userId}?${query.toString()}`,
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
    console.log("Fetched activity log data:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/activitylog/[id] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
