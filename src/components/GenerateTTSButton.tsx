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

  const generateForAllPanels = async () => {
    try {
      const updatedPanels = [...story.panels];

      for (let i = 0; i < updatedPanels.length; i++) {
        const panel = updatedPanels[i];

        setLoadingIndex(i);
        setStep("generating");

        const ttsRes = await fetch("/api/stories/ai/tts/pollinationai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: panel.content,
            voiceId: "nova",
            additionalInstructions: "Read clearly for children",
          }),
        });

        if (!ttsRes.ok) throw new Error("TTS failed");

        const audioBlob = await ttsRes.blob();

        setStep("uploading");

        const file = new File([audioBlob], `panel-${i}.mp3`, {
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

        updatedPanels[i].audioUrl = cdnUrl;

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

      // Save story with all audio URLs
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
