import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const fallbackModels = ["flux", "kontext", "turbo", "gptimage"];

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();

    const {
      translatedDescription,
      colorStyle,
      width = 512,
      height = 512,
      modelId,
    } = body;

    // console.log("Translated Description:", translatedDescription);
    // console.log("Color Style:", colorStyle);

    const prompt = `
    A imaginative children's storybook **illustration** (not a book cover) based on the following story description. The image must be highly detailed and suitable for children. Do **not** include any text, letters, or titles in the image. Avoid all writing, typography, and symbols.

    "${translatedDescription}"

    With this color sytle: "${colorStyle}"
    `.trim();

    console.log("Finalized prompt:", prompt);

    const modelsToTry = modelId
      ? [modelId, ...fallbackModels.filter((m) => m !== modelId)]
      : fallbackModels;

    let lastError: string | Error | null = null;

    for (const model of modelsToTry) {
      console.log(`Trying model: ${model}`);
      try {
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
              modelId: model,
            }),
          }
        );

        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const mime = res.headers.get("content-type") || "image/png";
          const dataUrl = `data:${mime};base64,${base64}`;

          console.log(`Successfully generated image with model: ${model}`);
          return NextResponse.json({ url: dataUrl, modelUsed: model });
        } else {
          lastError = `Model ${model} failed with status ${res.status}`;
          console.warn(lastError);
        }
      } catch (err) {
        lastError = `Model ${model} threw error: ${err}`;
        console.warn(lastError);
      }
    }

    console.error("All models failed:", lastError);
    return NextResponse.json(
      { error: "All models failed to generate image" },
      { status: 500 }
    );
  } catch (err) {
    console.error("POST /api/stories/ai/generate-image error:", err);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
