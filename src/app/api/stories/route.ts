import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Story`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch users", error: log },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log(data);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/users response:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();

    console.log("Fetched!!! - POST story");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Story`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Backend /Story POST failed:", error);
      return NextResponse.json(
        { message: "Failed to create story", error },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("POST - /api/users/create error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "Missing story ID" },
        { status: 400 }
      );
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Story`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { message: "Failed to update story", error },
        { status: res.status }
      );
    }

    const text = await res.text();
    console.log("Raw response text from backend:", text);

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: 200 });
    } catch (err) {
      return NextResponse.json(
        { message: "Failed to parse JSON", raw: text },
        { status: 500 }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("PUT /api/stories error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
