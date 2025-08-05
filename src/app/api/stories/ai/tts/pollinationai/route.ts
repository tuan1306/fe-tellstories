import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const MAX_CHUNK_LENGTH = 450;

function splitTextIntoChunks(text: string, maxLength: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length <= maxLength) {
      current += sentence;
    } else {
      if (current) chunks.push(current.trim());
      current = sentence;
    }
  }

  if (current) chunks.push(current.trim());
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;

    const body = await req.json();
    const { text, voiceId = "alloy", additionalInstructions = "" } = body;

    if (!text) {
      console.warn("No text provided in TTS request.");
      return NextResponse.json(
        { message: "Text is required" },
        { status: 400 }
      );
    }

    const chunks = splitTextIntoChunks(text, MAX_CHUNK_LENGTH);

    const audioBuffers: Uint8Array[] = [];

    // Generation
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Cooldown 10s for every 5 chunk.
      if (i > 0 && i % 5 === 0) {
        console.log(`[TTS] Cooldown rn at chunk ${i}`);
        await new Promise((resolve) => setTimeout(resolve, 10_000));
      }

      console.log(
        `[TTS] Generating audio for chunk ${i + 1}/${chunks.length}:`,
        chunk
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pollinationai/generate-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: chunk,
            voiceId,
            additionalInstructions,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `[TTS] Error from TTS API for chunk ${i + 1}:`,
          errorText
        );
        return NextResponse.json(
          { message: "TTS failed", error: errorText },
          { status: res.status }
        );
      }

      const audioBlob = await res.blob();
      const buffer = await audioBlob.arrayBuffer();
      audioBuffers.push(new Uint8Array(buffer));
    }

    // Concat
    const totalLength = audioBuffers.reduce((acc, b) => acc + b.length, 0);
    const concatenated = new Uint8Array(totalLength);
    let offset = 0;
    for (const b of audioBuffers) {
      concatenated.set(b, offset);
      offset += b.length;
    }

    return new NextResponse(Buffer.from(concatenated.buffer), {
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
