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
import WritingAnimation from "@/components/misc/animated-icons/Writing";
import { ImagePlus, Loader2 } from "lucide-react";

interface ImagePanelDialogProps {
  panels: { imageUrl?: string; content?: string }[];
  panelIndex: number;
  onImageSelect: (imageUrl: string) => void;
}

export function ImagePanelDialog({
  panels,
  panelIndex,
  onImageSelect,
}: ImagePanelDialogProps) {
  const [open, setOpen] = useState(false);
  const [pickingFile, setPickingFile] = useState(false);
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

  // Handling cancellation in panel image uploading
  // The reason is on some browser onFocus is processed before onChange can process
  // In other words, it reset the file input to null.
  const handleUploadClick = () => {
    setPickingFile(true);
    setImageMode("manual");

    const onFocus = () => {
      setTimeout(() => {
        if (!fileInputRef.current?.files?.length) {
          setPickingFile(false);
          setImageMode(null);
        }
      }, 200); // small delay to let onChange run first
      window.removeEventListener("focus", onFocus);
    };

    window.addEventListener("focus", onFocus);
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/cdn/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!json.url) throw new Error("Upload failed");

      onImageSelect(json.url);
      setOpen(false);
    } catch {
      alert("Upload failed");
    } finally {
      setImageMode(null);
      setPickingFile(false);
      e.target.value = ""; // allow reselect same file
    }
  };

  const handleAIImageGenerate = async () => {
    try {
      setGeneratingImage(true);

      const translationRes = await fetch("/api/stories/ai/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receivedPrompt: imagePrompt || "",
          //   storyContext: story?.panels[panelIndex]?.content || "",
        }),
      });

      if (!translationRes.ok) throw new Error("Prompt translation failed");

      const translatedRaw = await translationRes.json();
      const translatedDescription = translatedRaw.data.replace(/^"|"$/g, "");

      const imageRes = await fetch("/api/stories/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translatedDescription,
          colorStyle: selectedStyle,
          width: 1024,
          height: 576,
        }),
      });

      if (!imageRes.ok) throw new Error("Image generation failed");

      const data = await imageRes.json();
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
    const file = new File([blob], "panel.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/cdn/upload", {
      method: "POST",
      body: formData,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadJson.url) return alert("Upload failed");

    onImageSelect(uploadJson.url);

    setImagePrompt("");
    setAiImagePreviewUrl(null);
    setCroppedImageUrl(null);
    setImageMode(null);
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => {
          setImageMode(null);
          setOpen(true);
        }}
        className="relative w-64 h-40 mx-auto overflow-hidden rounded-xl shadow cursor-pointer hover:opacity-70 transition"
      >
        {panels[panelIndex]?.imageUrl ? (
          <Image
            src={panels[panelIndex].imageUrl!}
            alt={`Panel ${panelIndex + 1}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">
              Thêm ảnh
            </span>
          </div>
        )}
      </div>

      {imageMode === "manual" && (
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={imageMode === "ai" ? "sm:max-w-4xl" : "sm:max-w-md"}
        >
          <DialogHeader>
            <DialogTitle>Thêm ảnh vào truyện</DialogTitle>
          </DialogHeader>

          {!imageMode && !pickingFile && (
            <div className="space-y-2">
              <Button className="w-full" onClick={handleUploadClick}>
                Upload from Device
              </Button>

              <Button
                className="w-full"
                onClick={() => {
                  setImageMode("ai");
                  setImagePrompt(panels[panelIndex]?.content || "");
                }}
              >
                Generate with AI
              </Button>
            </div>
          )}

          {pickingFile && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Đang chọn ảnh...</p>
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
                  ← Back
                </Button>

                <Textarea
                  placeholder="Enter a short panel description..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="min-h-[250px]"
                />

                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cartoonish">Cartoonish</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="sketch">Sketch</SelectItem>
                    <SelectItem value="watercolor">Watercolor</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={handleAIImageGenerate}
                  disabled={!imagePrompt || generatingImage}
                >
                  {generatingImage ? "Generating..." : "Generate Image"}
                </Button>

                {croppedImageUrl && (
                  <Button
                    className="w-full"
                    onClick={handleFinalUpload}
                    disabled={generatingImage}
                  >
                    {generatingImage ? "Please wait..." : "Use This Image"}
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
                      <WritingAnimation />
                    ) : (
                      <p>Your preview image will be here.</p>
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
