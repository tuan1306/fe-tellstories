import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Story/publish-request/pending?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const log = await res.text();
      return NextResponse.json(
        { message: "Failed to fetch pending story list", error: log },
        { status: res.status }
      );
    }

    const data = await res.json();
    // console.log(data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET - /api/pending response:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();

    const { id, action, reviewNotes } = body;

    const actionEndpoint =
      action === "approve" ? "approve" : action === "reject" ? "reject" : null;

    if (!actionEndpoint) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Story/publish-request/${actionEndpoint}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, reviewNotes }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { message: "Action failed", error: err },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: `${action} success` });
  } catch (err) {
    console.error("PUT - /api/pending error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
