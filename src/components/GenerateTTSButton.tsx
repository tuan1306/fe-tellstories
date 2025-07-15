"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function GenerateTTSButton({ content }: { content: string }) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateTTS = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stories/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          voiceId: "nova",
          additionalInstructions: "Read clearly for children",
        }),
      });

      if (!res.ok) throw new Error("Failed to generate audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error("TTS error:", err);
    } finally {
      setLoading(false);
    }
  };

  return audioUrl ? (
    <audio controls className="w-full" src={audioUrl}>
      Your browser does not support the audio element.
    </audio>
  ) : (
    <Button onClick={generateTTS} disabled={loading} className="w-full">
      {loading ? "Generating..." : "Generate Audio"}
    </Button>
  );
}
