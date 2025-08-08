"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("ID: " + params);

    const token = (await cookies()).get("authToken")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Comment/thread/${
        (
          await params
        ).id
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch comment thread", error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/Comment/thread/[commentId] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
