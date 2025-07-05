import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "Missing story ID" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Story/EditStoryMeta`,
      {
        method: "PATCH",
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
        { message: "Failed to update story", error },
        { status: res.status }
      );
    }

    const text = await res.text();
    const data = JSON.parse(text);

    console.log("Data: " + text);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("PUT /api/stories/meta error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
