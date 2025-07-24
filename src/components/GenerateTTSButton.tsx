"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StoryDetails } from "@/app/types/story";

export default function GenerateTTSButton({
  story,
  currentPanelIndex,
  setStory,
}: {
  story: StoryDetails;
  currentPanelIndex: number;
  setStory: React.Dispatch<React.SetStateAction<StoryDetails | null>>;
}) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [step, setStep] = useState<null | "generating" | "uploading">(null);

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

  const generateForAllPanels = async () => {
    try {
      const updatedPanels = [...story.panels];

      for (let i = 0; i < updatedPanels.length; i++) {
        const panel = updatedPanels[i];

        setLoadingIndex(i);
        setStep("generating");

        const chunks = splitTextIntoChunks(panel.content, 300);
        const audioBlobs: Blob[] = [];

        for (const chunk of chunks) {
          const res = await fetch("/api/stories/ai/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: chunk,
              voiceId: "nova",
              additionalInstructions: "Read clearly for children",
            }),
          });

          if (!res.ok) throw new Error("TTS failed");
          const blob = await res.blob();
          audioBlobs.push(blob);
        }

        setStep("uploading");

        const fullBlob = new Blob(audioBlobs, { type: "audio/mpeg" });
        const file = new File([fullBlob], `panel-${i}.mp3`, {
          type: "audio/mpeg",
        });

        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/cdn/upload", {
          method: "POST",
          body: formData,
        });

        const uploadText = await uploadRes.text();
        if (!uploadRes.ok) throw new Error("Upload failed");

        const json = JSON.parse(uploadText);
        const cdnUrl = json?.data?.url || json?.url;

        if (i === currentPanelIndex) {
          setStory((prev) =>
            prev
              ? {
                  ...prev,
                  panels: prev.panels.map((p, idx) =>
                    idx === i ? { ...p, audioUrl: cdnUrl } : p
                  ),
                }
              : prev
          );
        }
      }

      // Update story with all audio URLs
      const updateRes = await fetch("/api/stories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...story,
          panels: updatedPanels,
          tags: {
            tagNames: story.tags.map((tag) => tag.name),
          },
        }),
      });

      const resultText = await updateRes.text();
      console.log("PUT /api/stories result:", resultText);
    } catch (err) {
      console.error("Error generating audio for all panels:", err);
    } finally {
      setStep(null);
      setLoadingIndex(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Button onClick={generateForAllPanels} disabled={step !== null}>
        {step
          ? `Panel ${loadingIndex! + 1} - ${
              step === "generating" ? "Generating..." : "Uploading..."
            }`
          : "Generate Audio"}
      </Button>
      {step && <Progress value={step === "generating" ? 50 : 100} />}
    </div>
  );
}
