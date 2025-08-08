"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import { StoryEditDetails } from "@/app/types/story";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { VoicePreviewButton } from "./VoicePreviewButton";
import { Label } from "./ui/label";

export default function GenerateTTSButton({
  story,
  currentPanelIndex,
  setStory,
}: {
  story: StoryEditDetails;
  currentPanelIndex: number;
  setStory: React.Dispatch<React.SetStateAction<StoryEditDetails | null>>;
}) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [step, setStep] = useState<null | "generating" | "uploading">(null);

  const [selectedLanguage, setSelectedLanguage] = useState<"ENG" | "VIE" | "">(
    ""
  );
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  const generateForAllPanels = async () => {
    if (!selectedLanguage || !selectedVoice) {
      alert("Vui lòng chọn ngôn ngữ và giọng đọc trước khi tạo.");
      return;
    }

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
            voiceId: selectedVoice,
            additionalInstructions: "Read clearly for children",
          }),
        });

        if (!ttsRes.ok) throw new Error("TTS failed");

        const audioBlob = await ttsRes.blob();

        setStep("uploading");

        // Concat
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

        // Assign the audio url per panel
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

      const payload = {
        ...story,
        panels: updatedPanels,
        tags: {
          tagNames: story.tags?.tagNames || [],
        },
      };

      // Save story with all mapped audio URLs
      const updateRes = await fetch("/api/stories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
    <div className="w-full flex flex-col gap-2 mt-4">
      <Select
        value={selectedLanguage}
        onValueChange={(val: "ENG" | "VIE") => setSelectedLanguage(val)}
      >
        <Label className="text-muted-foreground">Ngôn ngữ:</Label>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn ngôn ngữ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ENG">Tiếng Anh</SelectItem>
          <SelectItem value="VIE">Tiếng Việt</SelectItem>
        </SelectContent>
      </Select>

      {selectedLanguage === "ENG" && (
        <div className="flex flex-col space-y-2 mt-2">
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <Label className="text-muted-foreground">Giọng đọc:</Label>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose English voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alloy">Neutral</SelectItem>
              <SelectItem value="echo">Energetic</SelectItem>
              <SelectItem value="fable">Warm</SelectItem>
              <SelectItem value="nova">Crispy</SelectItem>
              <SelectItem value="shimmer">Playful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedLanguage === "VIE" && (
        <div className="flex flex-col space-y-2 mt-2">
          <Label className="text-muted-foreground">Giọng đọc:</Label>

          <div className="flex items-center space-x-2">
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hcm-diemmy">Nữ - Miền Nam</SelectItem>
                <SelectItem value="hn-phuongtrang">Nữ - Miền Bắc</SelectItem>
                <SelectItem value="hcm-minhquan">Nam - Miền Nam</SelectItem>
                <SelectItem value="hn-thanhtung">Nam - Miền Bắc</SelectItem>
              </SelectContent>
            </Select>

            <VoicePreviewButton selectedVoice={selectedVoice} />
          </div>
        </div>
      )}

      <Button
        onClick={generateForAllPanels}
        disabled={step !== null || !selectedLanguage || !selectedVoice}
        className="mt-4"
      >
        {step
          ? `Panel ${loadingIndex! + 1} - ${
              step === "generating" ? "Đang tạo..." : "Đang đăng tải lên..."
            }`
          : "Tạo giọng đọc cho truyện"}
      </Button>

      {/* {step && <Progress value={step === "generating" ? 50 : 100} />} */}
    </div>
  );
}
