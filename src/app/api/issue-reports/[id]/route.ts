import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    // console.log("Issue ID: " + (await params).id);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/IssueReport/staff/resolved/${
        (
          await params
        ).id
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { message: "Failed to mark issue as resolved", error },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("PUT - /api/issue/[id]/resolve error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
