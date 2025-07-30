export async function generateConcatenatedTTS({
  text,
  voiceId = "nova",
  endpoint = "/api/stories/ai/tts",
  maxChunkLength = 300,
}: {
  text: string;
  voiceId?: string;
  endpoint?: string;
  maxChunkLength?: number;
}): Promise<Blob> {
  const splitTextIntoChunks = (text: string, maxLength: number) => {
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
  };

  const chunks = splitTextIntoChunks(text, maxChunkLength);
  const audioBlobs: Blob[] = [];

  for (const chunk of chunks) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: chunk,
        voiceId,
        additionalInstructions: "Read clearly for children",
      }),
    });

    if (!res.ok) throw new Error("TTS request failed");
    const blob = await res.blob();
    audioBlobs.push(blob);
  }

  return new Blob(audioBlobs, { type: "audio/mpeg" });
}
