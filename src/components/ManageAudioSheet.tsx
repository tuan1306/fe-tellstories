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
import GenerateTTSButton from "./GenerateTTSButton";
import { ScrollArea } from "./ui/scroll-area";

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
  const [musicUrl, setMusicUrl] = useState(story.backgroundMusicUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

      const payload = {
        ...story,
        backgroundMusicUrl: newMusicUrl,
        panels: story.panels || [],
        tags: {
          tagNames: story.tags?.tagNames || [],
        },
      };

      // console.log("Sending PUT payload to /api/stories:", payload);

      const updateRes = await fetch(`/api/stories`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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

            {/* I will get the information from the CDN by tmr */}
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
                  style={{
                    border: "3px solid #1d293d",
                  }}
                />
              </div>
            )}

            <div className="mt-4">
              <h1 className="text-md gap-2 align-middle items-center flex font-semibold">
                <AudioLines className="w-6 h-6 text-amber-400" />
                Chọn loại giọng cho truyện
              </h1>
              <GenerateTTSButton
                story={story}
                currentPanelIndex={0}
                setStory={() => {}}
              />
            </div>

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
                style={{
                  border: "3px solid #1d293d",
                }}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || (!selectedFile && !musicUrl)}
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
