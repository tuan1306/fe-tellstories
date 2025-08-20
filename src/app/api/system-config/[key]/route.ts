import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();
    const { key } = await params;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/SystemConfigs/${key}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { message: `Failed to update config: ${key}`, error },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("PUT - /api/SystemConfigs/[key] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
