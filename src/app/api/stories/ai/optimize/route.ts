import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

function isVietnamese(text: string): boolean {
  return /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(
    text
  );
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const { receivedPrompt } = await req.json();

    // console.log("ReceivedPrompt: " + receivedPrompt);

    let prompt = receivedPrompt;

    console.log("Is the prompt received Vietnamese:", isVietnamese(prompt));

    if (isVietnamese(receivedPrompt)) {
      prompt = `Tối ưu hóa prompt sau đây cho việc tạo truyện, chỉ trả lời nội dung prompt thôi, phần prompt dưới 400 từ bằng tiếng Việt, không cần trả lời tôi: ${receivedPrompt}`;
    } else {
      prompt = `Optimize the following prompt for creating a children's story. Only return the optimized prompt (under 400 words), no extra text: ${receivedPrompt}`;
    }

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
            Temperature: 0.7,
            TopP: 0.9,
            TopK: 40,
            StopSequences: ["Kết thúc tối ưu", "End of optimization"],
            AdditionalSystemInstruction: `
            You are a creative story-writing assistant specialized in helping parents turn their ideas into engaging stories for children.

            Your task is to optimize the given prompt to make it:
            - Suitable for young readers (ages 3–10)
            - Easy to understand with clear language
            - Imaginative, whimsical, and emotionally warm
            - Focused on 1–2 main characters (e.g., animals, kids, or magical creatures)
            - Centered around a simple, positive moral or learning theme

            Output Requirements:
            - Respond ONLY with the optimized prompt (max 400 words)
            - Do not include explanations, instructions, or system messages
            - Write in the same language as the input prompt
            `,
          },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("External API status:", res.status);
      console.error("External API response:", error);

      return NextResponse.json(
        { message: "Failed to generate story", error },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Parsed story response:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("POST /api/stories/ai error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
