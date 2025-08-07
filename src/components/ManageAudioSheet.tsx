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
import { Label } from "@/components/ui/label";

export function ManageAudioSheet({
  children,
  story,
  onSuccess,
}: {
  children: React.ReactNode;
  story: StoryEditDetails;
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

      console.log("Sending PUT payload to /api/stories:", payload);

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
        <div className="p-5">
          <SheetHeader className="p-0">
            <SheetTitle className="text-2xl">Quản lý âm thanh</SheetTitle>
            <SheetDescription className="mb-5">
              Âm thanh được đăng tải ở đây sẽ được chơi cùng với truyện
            </SheetDescription>
          </SheetHeader>

          <div>
            <Label htmlFor="audioFile">Chọn tệp âm thanh</Label>
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

          {musicUrl && !selectedFile && (
            <div className="mt-4">
              <Label>Nhạc nền hiện tại:</Label>
              <audio controls src={musicUrl} className="w-full mt-2" />
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={saving || (!selectedFile && !musicUrl)}
            className="w-full mt-6"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
