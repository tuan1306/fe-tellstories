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
      prompt = `Tối ưu hóa prompt sau đây để tạo truyện, chia nội dung thành các phần rõ ràng theo thứ tự:
      1. Nội dung ngắn gọn (tóm tắt)
      2. Nhân vật (mô tả từng nhân vật)
      3. Các yếu tố quan trọng khác (bối cảnh, chủ đề)
      Chỉ trả lời nội dung prompt, không giải thích thêm, độ dài dưới 400 từ, bằng tiếng Việt:
      ${receivedPrompt}`;
    } else {
      prompt = `Optimize the following prompt for creating a children's story, separating it into clear ordered sections:
      1. Short content (summary)
      2. Characters (describe each character)
      3. Other important elements (setting, theme)
      Only return the optimized prompt (under 400 words), no extra text:
      ${receivedPrompt}`;
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
