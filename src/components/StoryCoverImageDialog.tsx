/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import WritingAnimation from "@/components/misc/animated-icons/Writing";
import { StoryEditDetails } from "@/app/types/story";
import { Loader2 } from "lucide-react";

interface StoryCoverImageDialogProps {
  story: StoryEditDetails;
  onUpdate: (updated: StoryEditDetails) => void;
}

export function StoryCoverImageDialog({
  story,
  onUpdate,
}: StoryCoverImageDialogProps) {
  const [open, setOpen] = useState(false);
  const [imageMode, setImageMode] = useState<"manual" | "ai" | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cartoonish");
  const [aiImagePreviewUrl, setAiImagePreviewUrl] = useState<string | null>(
    null
  );
  const [generatingImage, setGeneratingImage] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/cdn/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (!json.url) return alert("Upload failed");

    await updateStoryCover(json.url);
  };

  const updateStoryCover = async (url: string) => {
    const updatedStory = {
      ...story,
      coverImageUrl: url,
      tags: {
        tagNames: Array.isArray(story.tags)
          ? story.tags.map((tag) => tag.name)
          : story.tags?.tagNames || [],
      },
    };

    const updateRes = await fetch("/api/stories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStory),
    });

    if (updateRes.ok) {
      onUpdate(updatedStory);
      setOpen(false);
    } else {
      alert("Failed to update story");
    }
  };

  const handleAIImageGenerate = async () => {
    try {
      setGeneratingImage(true);

      const translationRes = await fetch("/api/stories/ai/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receivedPrompt: imagePrompt || story?.description || "",
          storyContext: story?.panels[0].content,
        }),
      });

      if (!translationRes.ok) throw new Error("Prompt translation failed");

      // Prompt stuff
      const translatedRaw = await translationRes.json();
      const translatedDescription = translatedRaw.data.replace(/^"|"$/g, "");
      console.log("✅ Translated Prompt:", translatedDescription);

      const colorStyle = selectedStyle;

      const imageRes = await fetch("/api/stories/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translatedDescription: translatedDescription,
          colorStyle: colorStyle,
          width: 512,
          height: 512,
        }),
      });

      if (!imageRes.ok) throw new Error("Image generation failed");

      const data = await imageRes.json();

      // If url string exist -> use the picture.
      setAiImagePreviewUrl(data.url);
      setCroppedImageUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleCropConfirm = async () => {
    if (!aiImagePreviewUrl || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(
      aiImagePreviewUrl,
      croppedAreaPixels
    );
    const previewUrl = URL.createObjectURL(croppedBlob);
    setCroppedImageUrl(previewUrl);
    setCropping(false);
  };

  const handleFinalUpload = async () => {
    if (!croppedImageUrl) return;

    const res = await fetch(croppedImageUrl);
    const blob = await res.blob();
    const file = new File([blob], "cropped.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/cdn/upload", {
      method: "POST",
      body: formData,
    });

    const uploadJson = await uploadRes.json();
    if (!uploadJson.url) return alert("Upload failed");

    await updateStoryCover(uploadJson.url);

    setImagePrompt("");
    setAiImagePreviewUrl(null);
    setCroppedImageUrl(null);
    setImageMode(null);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="relative w-64 h-96 mx-auto overflow-hidden rounded-xl shadow-2xl cursor-pointer hover:opacity-70 transition"
      >
        {story.coverImageUrl?.startsWith("http") ? (
          <Image
            src={story.coverImageUrl}
            alt={story.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">
            Nhấp để thêm ảnh
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setImageMode(null);
            setImagePrompt("");
            setAiImagePreviewUrl(null);
            setCroppedImageUrl(null);
          }
        }}
      >
        <DialogContent
          className={imageMode === "ai" ? "sm:max-w-4xl" : "sm:max-w-md"}
        >
          <DialogHeader>
            <DialogTitle>Đăng tải ảnh bìa</DialogTitle>
          </DialogHeader>

          {!imageMode && (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Đăng tải từ máy tính
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setImageMode("ai");
                  setImagePrompt(story.description || "");
                }}
              >
                Tạo bằng AI
              </Button>
            </div>
          )}

          {imageMode === "ai" && (
            <div className="flex gap-4 max-h-[600px]">
              <div className="flex-1 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setImageMode(null);
                    setAiImagePreviewUrl(null);
                    setCroppedImageUrl(null);
                    setImagePrompt("");
                  }}
                >
                  ← Quay lại
                </Button>

                <Textarea
                  placeholder="Enter a short story description..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="min-h-[250px]"
                />

                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cartoonish">Hoạt hình</SelectItem>
                    <SelectItem value="realistic">Ảnh thật</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="sketch">Màu chì</SelectItem>
                    <SelectItem value="watercolor">Màu nước</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={handleAIImageGenerate}
                  disabled={!imagePrompt || generatingImage}
                >
                  {generatingImage ? "Đang tạo..." : "Tạo ảnh bằng AI"}
                </Button>

                {croppedImageUrl && (
                  <Button
                    className="w-full"
                    onClick={handleFinalUpload}
                    disabled={generatingImage}
                  >
                    {generatingImage ? "Xin chờ..." : "Sử dụng ảnh này"}
                  </Button>
                )}
              </div>

              <div className="w-[4px] bg-slate-700 rounded-2xl" />

              <div className="flex-1 flex items-center justify-center">
                {croppedImageUrl ? (
                  <button
                    onClick={() => setCropping(true)}
                    className="focus:outline-none"
                  >
                    <img
                      src={croppedImageUrl}
                      alt="Cropped Preview"
                      className="max-w-full max-h-[500px] object-contain border rounded-lg shadow hover:opacity-80 transition"
                    />
                  </button>
                ) : aiImagePreviewUrl && !generatingImage ? (
                  <button
                    onClick={() => setCropping(true)}
                    className="focus:outline-none"
                  >
                    <img
                      src={aiImagePreviewUrl}
                      alt="AI Preview"
                      className="max-w-full max-h-[500px] object-contain border rounded-lg shadow hover:opacity-80 transition"
                    />
                  </button>
                ) : (
                  <div className="w-full flex justify-center items-center text-sm text-gray-500 text-center">
                    {generatingImage ? (
                      <Loader2 className="w-12 h-12 animate-spin" />
                    ) : (
                      <p>Ảnh bìa của bạn sẽ xuất hiện ở đây để preview</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {cropping && aiImagePreviewUrl && (
        <Dialog open={cropping} onOpenChange={setCropping}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crop Image</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-[500px] bg-black">
              <Cropper
                image={aiImagePreviewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setCropping(false)}>
                Cancel
              </Button>
              <Button onClick={handleCropConfirm}>Crop and Preview</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
