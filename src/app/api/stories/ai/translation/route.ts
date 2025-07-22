import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const { receivedPrompt } = await req.json();

    // console.log("ReceivedPrompt: " + receivedPrompt);

    const prompt = `
    Translate the following Vietnamese children's story description into clear, concise English. Keep all key characters, objects, events, and actions intact so the AI understands the story's core content. Do not explain or annotate. Only return the English translation.

    "${receivedPrompt}"
    `;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Provider: "Gemini",
          Prompt: prompt,
          Options: {
            Temperature: 0.6,
            TopP: 0.9,
            TopK: 40,
            StopSequences: ["Kết thúc dịch"],
            AdditionalSystemInstruction:
              "Chỉ trả về bản dịch tiếng Anh rõ ràng, cô đọng, làm nổi bật các sự kiện, đồ vật, nhân vật trong văn bản gốc.",
          },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("External API status:", res.status);
      console.error("External API response:", error);

      return NextResponse.json(
        { message: "Failed to translate prompt", error },
        { status: res.status }
      );
    }

    const data = await res.json();
    // console.log("Translated English Prompt:", data?.data || data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("POST /api/stories/ai/translation error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
