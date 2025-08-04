import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const { receivedPrompt, storyContext } = await req.json();

    // console.log("ReceivedPrompt: " + receivedPrompt);

    const combinedPrompt = storyContext
      ? `${receivedPrompt.trim()}\n\nAdditional context:\n${storyContext.trim()}`
      : receivedPrompt;

    const prompt = `
    Translate and summarize the following Vietnamese children's story description into clear, concise English suitable for AI image generation. Focus on the essential characters, events, and objects. Keep the tone imaginative but remove unnecessary details.

    The final result should be no longer than 150 tokens (approximately 110–120 words). Do not explain or annotate. Only return the summarized English translation.

    "${combinedPrompt}"
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
              "Only return a clear and concise English translation that highlights the events, objects, and characters in the original text.",
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
