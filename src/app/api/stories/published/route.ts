import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "12";
    const isCommunity = searchParams.get("isCommunity");

    const queryParams = new URLSearchParams({
      page,
      pageSize,
    });

    if (isCommunity !== null) {
      queryParams.append("isCommunity", isCommunity);
    }

    const url = `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/Story/published?${queryParams.toString()}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch published stories", error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching published stories:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
