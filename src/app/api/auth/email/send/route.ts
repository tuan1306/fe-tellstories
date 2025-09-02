import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/send-email-confirmation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok || data.success === false) {
      return NextResponse.json(
        { message: "Không thể gửi email xác nhận. Vui lòng thử lại." },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("POST - /api/Auth/send-email-confirmation error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
