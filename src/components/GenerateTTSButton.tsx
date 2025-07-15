"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StoryPanel } from "@/app/types/panel";
import { StoryDetails } from "@/app/types/story";

export default function GenerateTTSButton({
  story,
  panel,
}: {
  story: StoryDetails;
  panel: StoryPanel;
}) {
  const [loadingStep, setLoadingStep] = useState<
    null | "generating" | "uploading"
  >(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateTTS = async () => {
    try {
      // Generate first
      setLoadingStep("generating");
      const ttsRes = await fetch("/api/stories/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: panel.content,
          voiceId: "nova",
          additionalInstructions: "Read clearly for children",
        }),
      });

      if (!ttsRes.ok) throw new Error("TTS failed");

      // Load & Upload to CDN
      const blob = await ttsRes.blob();

      setLoadingStep("uploading");
      const file = new File([blob], "tts.mp3", { type: "audio/mpeg" });
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/cdn/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const json = await uploadRes.json();
      const cdnUrl = json?.data?.url || json?.url;

      setAudioUrl(cdnUrl);

      // Update the story audio URL after upload to CDN
      await fetch("/api/stories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...story,
          panels: story.panels.map((p) =>
            p.panelNumber === panel.panelNumber ? { ...p, audioUrl: cdnUrl } : p
          ),
          tags: {
            tagNames: story.tags.map((tag) => tag.name),
          },
        }),
      });
    } catch (err) {
      console.error("Generate & upload error:", err);
    } finally {
      setLoadingStep(null);
    }
  };

  return audioUrl ? (
    <audio controls className="w-full" src={audioUrl}>
      Your browser does not support the audio element.
    </audio>
  ) : (
    <div className="w-full flex flex-col gap-2">
      <Button onClick={generateTTS} disabled={!!loadingStep} className="w-full">
        {loadingStep === "generating"
          ? "Generating..."
          : loadingStep === "uploading"
          ? "Uploading..."
          : "Generate Audio"}
      </Button>
      {loadingStep && (
        <Progress value={loadingStep === "generating" ? 50 : 100} />
      )}
    </div>
  );
}
