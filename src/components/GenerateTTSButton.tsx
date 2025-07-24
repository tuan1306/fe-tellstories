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
  const [audioUrl, setAudioUrl] = useState<string | null>(
    panel.audioUrl ?? null
  );

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

  const generateTTS = async () => {
    try {
      setLoadingStep("generating");

      const chunks = splitTextIntoChunks(panel.content, 300);
      console.log("Chunks to TTS:", chunks);

      const audioBlobs: Blob[] = [];

      for (const [i, chunk] of chunks.entries()) {
        console.log(`Sending chunk ${i + 1}:`, chunk);
        const res = await fetch("/api/stories/ai/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: chunk,
            voiceId: "nova",
            additionalInstructions: "Read clearly for children",
          }),
        });

        if (!res.ok)
          throw new Error(`TTS generation failed for chunk ${i + 1}`);
        const blob = await res.blob();
        console.log(`Received blob for chunk ${i + 1}:`, blob);
        audioBlobs.push(blob);
      }

      console.log("All audio blobs:", audioBlobs);

      const fullBlob = new Blob(audioBlobs, { type: "audio/mpeg" });
      console.log("Concatenated blob:", fullBlob);

      setLoadingStep("uploading");

      const file = new File([fullBlob], "tts.mp3", { type: "audio/mpeg" });
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file to /api/cdn/upload...");

      const uploadRes = await fetch("/api/cdn/upload", {
        method: "POST",
        body: formData,
      });

      const uploadText = await uploadRes.text();
      console.log("Upload response:", uploadText);

      if (!uploadRes.ok) throw new Error("Upload failed");
      const json = JSON.parse(uploadText);
      const cdnUrl = json?.data?.url || json?.url;
      console.log("CDN URL:", cdnUrl);

      setAudioUrl(cdnUrl);

      const updatedPanels = story.panels.map((p) =>
        p.panelNumber === panel.panelNumber ? { ...p, audioUrl: cdnUrl } : p
      );

      console.log("Sending PUT to /api/stories...");
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

      console.log("PUT /api/stories response:", await updateRes.text());
    } catch (err) {
      console.error("TTS generation/upload error:", err);
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
