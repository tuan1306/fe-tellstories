/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
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
import { StoryEditDetails } from "@/app/types/story";

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
  const [selectedModel, setSelectedModel] = useState("flux");
  const [aiImagePreviewUrl, setAiImagePreviewUrl] = useState<string | null>(
    null
  );
  const [generatingImage, setGeneratingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const updatedStory = {
      ...story,
      coverImageUrl: json.url,
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
        }),
      });

      if (!translationRes.ok) throw new Error("Prompt translation failed");
      const translationData = await translationRes.json();
      const translatedDescription =
        translationData.text || translationData.result || translationData.data;

      const imageRes = await fetch("/api/stories/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translatedDescription,
          width: 512,
          height: 512,
          modelId: selectedModel,
        }),
      });

      if (!imageRes.ok) throw new Error("Image generation failed");
      const data = await imageRes.json();
      setAiImagePreviewUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleUseGeneratedImage = async () => {
    if (!aiImagePreviewUrl) return;

    const imgRes = await fetch(aiImagePreviewUrl);
    const blob = await imgRes.blob();
    const file = new File([blob], "ai-generated.png", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/cdn/upload", {
      method: "POST",
      body: formData,
    });

    const uploadJson = await uploadRes.json();
    if (!uploadJson.url) return alert("Upload failed");

    const updated = {
      ...story,
      coverImageUrl: uploadJson.url,
      tags: {
        tagNames: Array.isArray(story.tags)
          ? story.tags.map((tag) => tag.name)
          : story.tags?.tagNames || [],
      },
    };

    const res = await fetch("/api/stories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      onUpdate(updated);
      setOpen(false);
      setAiImagePreviewUrl(null);
      setImagePrompt("");
    } else {
      alert("Failed to update story");
    }
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
            Click to Add Image
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
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Cover Image</DialogTitle>
          </DialogHeader>

          {!imageMode && (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload from Device
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setImageMode("ai");
                  setImagePrompt(story.description || "");
                }}
              >
                Generate with AI
              </Button>
            </div>
          )}

          {imageMode === "ai" && (
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setImageMode(null);
                  setAiImagePreviewUrl(null);
                  setImagePrompt("");
                }}
              >
                ← Back
              </Button>

              <Textarea
                placeholder="Enter a short story description..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />

              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flux">Flux</SelectItem>
                  <SelectItem value="kontext">Kontext</SelectItem>
                  <SelectItem value="turbo">Turbo</SelectItem>
                  <SelectItem value="gptimage">GPTImage</SelectItem>
                </SelectContent>
              </Select>

              {generatingImage && (
                <div className="w-full flex justify-center mb-2">
                  <WritingAnimation />
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleAIImageGenerate}
                disabled={!imagePrompt || generatingImage}
              >
                {generatingImage ? "Generating..." : "Generate Image"}
              </Button>

              {aiImagePreviewUrl && !generatingImage && (
                <>
                  <div className="w-full">
                    <img
                      src={aiImagePreviewUrl}
                      alt="AI Preview"
                      className="w-full max-h-64 object-contain"
                    />
                  </div>
                  <Button className="w-full" onClick={handleUseGeneratedImage}>
                    Use This Image
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
