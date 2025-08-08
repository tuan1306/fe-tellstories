import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const userId = (await params).id;

    const count = 3;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Story/recently-published/user/${userId}?count=${count}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch story", error: log },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("GET /api/stories/user/recently/[id]:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
