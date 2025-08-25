import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const storyId = (await params).id;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Story/${storyId}`,
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
    console.log("Fetched story data:", data);
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("GET /api/stories/[id]:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
