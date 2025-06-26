import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("authToken")?.value;

  console.log(
    "Called CDN URL: " + `${process.env.NEXT_PUBLIC_CDN_API_BASE_URL}`
  );

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
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
    const errText = await res.text();
    return NextResponse.json(
      { message: "Upload failed", error: errText },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}
