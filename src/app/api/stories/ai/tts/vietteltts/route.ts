import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();
    const {
      text,
      voiceId = "hcm-diemmy",
      additionalInstructions = "",
      autoChunk = true,
      chunkCharacterLength = 300,
      chunkDelayms = 500,
    } = body;

    if (!text) {
      console.warn("No text provided in TTS request.");
      return NextResponse.json(
        { message: "Text is required" },
        { status: 400 }
      );
    }

    console.log(`[TTS] Generating audio with autoChunk: ${autoChunk}`);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/viettelAI/generate-tts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          voiceId,
          additionalInstructions,
          autoChunk,
          chunkCharacterLength,
          chunkDelayms,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[TTS] Error from ViettelTTS API:", errorText);
      return NextResponse.json(
        { message: "TTS failed", error: errorText },
        { status: res.status }
      );
    }

    const audioBlob = await res.blob();
    const buffer = await audioBlob.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"',
      },
    });
  } catch (err) {
    console.error("[TTS] Unexpected server error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
