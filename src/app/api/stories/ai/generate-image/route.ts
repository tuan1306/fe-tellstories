import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();

    const { translatedDescription, width, height, modelId } = body;

    console.log("Image generation prompt:", translatedDescription);

    const prompt = `
    A vibrant, colorful, and imaginative children's storybook **illustration** (not a book cover) based on the following story description. The image must be highly detailed and suitable for children. Do **not** include any text, letters, or titles in the image. Avoid all writing, typography, and symbols.

    "${translatedDescription}"
    `.trim();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/polinationai/generate-image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          width,
          height,
          modelId,
        }),
      }
    );

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mime = res.headers.get("content-type") || "image/png";
    const dataUrl = `data:${mime};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error("POST /api/stories/ai/generate-image error:", err);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
