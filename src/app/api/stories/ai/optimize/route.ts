import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("authToken")?.value;
    const { receivedPrompt } = await req.json();

    console.log("ReceivedPrompt: " + receivedPrompt);

    const prompt = `Tối ưu hóa prompt sau đây cho việc tạo truyện, chỉ trả lời nội dung prompt thôi, phần prompt dưới 400 từ bằng tiếng Việt, không cần trả lời tôi: ${receivedPrompt}`;

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
            StopSequences: ["Kết thúc tối ưu"],
            AdditionalSystemInstruction:
              "Bạn là trợ lý viết truyện, hãy giúp phụ huynh tối ưu hóa ý tưởng viết truyện cho trẻ em một cách sáng tạo, ngắn gọn và dễ hiểu.",
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
