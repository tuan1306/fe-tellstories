import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();

    console.log("Vietnamese voiced picked!");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/viettelAI/generate-tts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: body.text,
          voiceID: body.voiceID || "hcm-diemmy",
          speed: body.speed ?? 1,
          withoutFilter: body.withoutFilter ?? false,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: "TTS failed", error: errorText },
        { status: res.status }
      );
    }

    const audioBlob = await res.blob();
    const audioBuffer = await audioBlob.arrayBuffer();

    console.log("TTS payload:", {
      text: body.text,
      voiceID: body.voiceID || "hcm-diemmy",
      speed: body.speed ?? 1,
      withoutFilter: body.withoutFilter ?? false,
    });

    return new NextResponse(Buffer.from(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"',
      },
    });
  } catch (err) {
    console.error("TTS Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
