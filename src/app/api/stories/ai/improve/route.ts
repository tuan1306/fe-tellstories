import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const body = await req.json();
    const { inputText } = body;

    if (!inputText || typeof inputText !== "string") {
      return NextResponse.json(
        { message: "Invalid inputText", received: body },
        { status: 400 }
      );
    }

    const isSingleWord = inputText.trim().split(/\s+/).length === 1;

    console.log("Is this a single word? " + isSingleWord);

    const prompt = isSingleWord
      ? `You're a helpful writing assistant. Suggest 1 vivid and expressive word replacements for the word "${inputText}", suitable for a children's story. Keep suggestions age-appropriate and imaginative.`
      : `You are a creative assistant helping polish children's story panels. Improve the following text by making it more vivid, expressive, and natural. Keep the original meaning, characters, and events intact. Do not summarize or rewrite the whole story—just improve clarity and storytelling.

    Text:
    "${inputText}"`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: "Gemini",
          prompt,
          options: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            stopSequences: [],
            additionalSystemInstruction: isSingleWord
              ? "You provide child-friendly, creative replacements for single words. Do not use capitalization or formatting."
              : `You are enhancing individual children's story panels. Keep the meaning but improve the emotional tone, clarity, and vocabulary while keeping it age-appropriate. 
              Do NOT include bold, italic, underline, or any kind of formatting. Return plain text only.`,
          },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("External API error:", error);
      return NextResponse.json(
        { message: "Failed to improve text", error },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("External API response JSON:", data);

    return NextResponse.json({ ...data, isSingleWord }, { status: 200 });
  } catch (error) {
    console.error("POST /api/stories/ai/improve error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
