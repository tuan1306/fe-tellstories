import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CDN_API_BASE_URL}/Files/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { message: "Upload failed", error: error },
        { status: res.status }
      );
    }

    // Send link
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET - /api/cdn/upload response:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
