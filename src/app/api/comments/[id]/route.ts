import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Comment/${(await params).id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { message: "Failed to delete comment", error },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("DELETE - /api/comments/[id] error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
