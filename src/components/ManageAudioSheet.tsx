"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoryEditDetails } from "@/app/types/story";
import { AudioLines, FileAudio, MicVocal, Music4 } from "lucide-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { VoicePreviewButton } from "./VoicePreviewButton";

export function ManageAudioSheet({
  children,
  story,
  currentPanelIndex,
  onSuccess,
}: {
  children: React.ReactNode;
  story: StoryEditDetails;
  currentPanelIndex: number;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  // File
  const [musicUrl, setMusicUrl] = useState(story.backgroundMusicUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // TTS
  const [selectedLanguage, setSelectedLanguage] = useState<"ENG" | "VIE" | "">(
    ""
  );
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  const generateForAllPanels = async (
    story: StoryEditDetails
  ): Promise<StoryEditDetails> => {
    if (!selectedLanguage || !selectedVoice) {
      alert("Vui lòng chọn ngôn ngữ và giọng đọc trước khi tạo.");
      return story;
    }

    const updatedPanels = [...story.panels];

    for (let i = 0; i < updatedPanels.length; i++) {
      const panel = updatedPanels[i];
      if (!panel.content?.trim()) continue;

      const ttsEndpoint =
        selectedLanguage === "VIE"
          ? "/api/stories/ai/tts/vietteltts"
          : "/api/stories/ai/tts/pollinationai";

      const ttsRes = await fetch(ttsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: panel.content,
          voiceId: selectedVoice,
          additionalInstructions:
            selectedLanguage === "ENG"
              ? "Read clearly for children"
              : "Đọc chậm, rõ ràng, truyền cảm cho trẻ em",
        }),
      });

      if (!ttsRes.ok) throw new Error(`TTS failed for panel ${i + 1}`);
      const audioBlob = await ttsRes.blob();

      const file = new File([audioBlob], `panel-${i + 1}.mp3`, {
        type: "audio/mpeg",
      });

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/cdn/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error(`Upload failed for panel ${i + 1}`);
      const json = await uploadRes.json();
      const cdnUrl = json?.data?.url || json?.url;

      updatedPanels[i] = { ...panel, audioUrl: cdnUrl };
    }

    return { ...story, panels: updatedPanels };
  };

  // Save
  const handleSave = async () => {
    try {
      setSaving(true);

      let newMusicUrl = musicUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/cdn/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("CDN upload failed.");
        const json = await uploadRes.json();
        newMusicUrl = json.url;
      }

      const updatedStory = await generateForAllPanels(story);

      const payload = {
        ...updatedStory,
        backgroundMusicUrl: newMusicUrl,
        tags: {
          tagNames: updatedStory.tags?.tagNames || [],
        },
      };

      // Save story
      const updateRes = await fetch(`/api/stories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(errorData.message || "Failed to update story");
      }

      setMusicUrl(newMusicUrl);
      setSelectedFile(null);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving audio:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-full">
          <div className="p-5">
            <SheetHeader className="p-0">
              <SheetTitle className="text-2xl">Quản lý âm thanh</SheetTitle>
              <SheetDescription className="mb-5">
                Âm thanh được đăng tải ở đây sẽ được chơi cùng với truyện
              </SheetDescription>
            </SheetHeader>

            {/* Music Upload */}
            <div>
              <h1 className="text-md gap-2 align-middle items-center flex font-semibold">
                <FileAudio className="w-6 h-6 text-cyan-400" />
                Chọn nhạc nền cho truyện
              </h1>
              <Input
                id="audioFile"
                type="file"
                accept="audio/*"
                className="mt-3"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
            </div>

            {/* Current Music */}
            {musicUrl && !selectedFile && (
              <div className="mt-4">
                <h1 className="text-md gap-2 align-middle items-center flex font-semibold">
                  <Music4 className="w-6 h-6 text-pink-600" />
                  Nhạc nền hiện tại của truyện
                </h1>
                <AudioPlayer
                  src={musicUrl}
                  autoPlay={false}
                  showJumpControls={false}
                  layout="horizontal"
                  customAdditionalControls={[]}
                  customVolumeControls={[]}
                  className="mt-2 rounded-lg"
                  style={{ border: "3px solid #1d293d" }}
                />
              </div>
            )}

            {/* TTS Language & Voice Selection */}
            <div className="w-full flex flex-col gap-2 mt-4">
              <h1 className="text-md gap-2 align-middle items-center flex font-semibold">
                <AudioLines className="w-6 h-6 text-amber-400" />
                Chọn loại giọng cho truyện
              </h1>
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
                  <Select
                    value={selectedVoice}
                    onValueChange={setSelectedVoice}
                  >
                    <Label className="text-muted-foreground">Giọng đọc:</Label>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose English voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Nữ</SelectItem>
                      {/* <SelectItem value="echo">Energetic</SelectItem> */}
                      <SelectItem value="fable">Nam</SelectItem>
                      {/* <SelectItem value="nova">Crispy</SelectItem>
                      <SelectItem value="shimmer">Playful</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedLanguage === "VIE" && (
                <div className="flex flex-col space-y-2 mt-2">
                  <Label className="text-muted-foreground">Giọng đọc:</Label>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedVoice}
                      onValueChange={setSelectedVoice}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hcm-diemmy">
                          Nữ - Miền Nam
                        </SelectItem>
                        <SelectItem value="hn-phuongtrang">
                          Nữ - Miền Bắc
                        </SelectItem>
                        <SelectItem value="hcm-minhquan">
                          Nam - Miền Nam
                        </SelectItem>
                        <SelectItem value="hn-thanhtung">
                          Nam - Miền Bắc
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <VoicePreviewButton selectedVoice={selectedVoice} />
                  </div>
                </div>
              )}
            </div>

            {/* Current Voice */}
            {story.panels[currentPanelIndex]?.audioUrl && (
              <div className="mt-4">
                <h1 className="text-md gap-2 align-middle items-center flex font-semibold">
                  <MicVocal className="w-6 h-6 text-fuchsia-500" />
                  Giọng đọc hiện tại của truyện
                </h1>
                <AudioPlayer
                  src={story.panels[currentPanelIndex].audioUrl}
                  autoPlay={false}
                  showJumpControls={false}
                  layout="horizontal"
                  customAdditionalControls={[]}
                  customVolumeControls={[]}
                  className="mt-2 rounded-lg"
                  style={{ border: "3px solid #1d293d" }}
                />
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving || (!selectedVoice && !musicUrl)}
              className="w-full mt-6"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
