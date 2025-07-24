"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoryEditDetails } from "@/app/types/story";
import { Button } from "@/components/ui/button";
import { EditStorySheet } from "@/components/EditStorySheet";
import Link from "next/link";
import PanelEditor from "@/components/misc/slideswiper/page";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import WritingAnimation from "@/components/misc/animated-icons/Writing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WriteStoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState<StoryEditDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [panelContents, setPanelContents] = useState<string[]>([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageMode, setImageMode] = useState<"manual" | "ai" | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("flux");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [aiImagePreviewUrl, setAiImagePreviewUrl] = useState<string | null>(
    null
  );
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!confirmingDelete) return;

    const timeout = setTimeout(() => {
      setConfirmingDelete(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [confirmingDelete]);

  const fetchStoryById = async (storyId: string) => {
    try {
      const res = await fetch(`/api/stories/${storyId}`);
      const json = await res.json();

      setStory(json.data.data);
      setPanelContents(
        (json.data.data.panels as { content: string }[]).map(
          (p) => p.content || ""
        )
      );
    } catch (err) {
      console.error("Failed to fetch story:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof id === "string") {
      fetchStoryById(id);
    }
  }, [id]);

  const handleSave = async () => {
    if (!story) return;

    const updatedPanels = story.panels.map((panel, i) => ({
      ...panel,
      content: panelContents[i] || "",
    }));

    const payload = {
      ...story,
      id: story.id,
      panels: updatedPanels,
      tags: { tagNames: [] },
    };

    const res = await fetch("/api/stories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Saved!");
      fetchStoryById(story.id);
    } else {
      const error = await res.json();
      alert("Failed to save: " + error.message);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !story) return;

    // Upload file first
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
      setStory(updatedStory);
      setOpenImageDialog(false);
    } else {
      alert("Failed to update story");
    }
  };

  const handleAIImageGenerate = async () => {
    try {
      setGeneratingImage(true);

      // Prompt Translation
      const translationRes = await fetch("/api/stories/ai/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receivedPrompt: imagePrompt || story?.description || prompt,
        }),
      });

      if (!translationRes.ok) {
        const text = await translationRes.text();
        throw new Error(`Translation failed: ${text}`);
      }

      const translationData = await translationRes.json();
      const translatedDescription =
        translationData.text || translationData.result || translationData.data;

      // Translate prompt -> Generate image
      const res = await fetch("/api/stories/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translatedDescription,
          width: 512,
          height: 512,
          modelId: selectedModel,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Image API failed: ${text}`);
      }

      const data = await res.json();
      setAiImagePreviewUrl(data.url);
    } catch (err) {
      console.error("Image generation failed:", err);
      alert("Something went wrong while generating the image.");
    } finally {
      setGeneratingImage(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!story) return <div className="p-4">Story not found.</div>;

  return (
    <div className="mt-4 h-[90vh] flex flex-col xl:flex-row gap-8">
      {/* LEFT */}
      <div className="w-full xl:w-1/3 flex flex-col overflow-hidden h-full">
        <div className="bg-primary-foreground p-4 rounded-lg flex flex-col h-full overflow-hidden">
          <div className="mb-4">
            <div className="w-full">
              <h1 className="text-xl font-semibold">Story Details</h1>
              <h1 className="text-sm text-muted-foreground">
                Key details and metadata about this story
              </h1>
            </div>
            <div className="pb-2 border-b mt-4">
              <EditStorySheet
                story={story}
                onSuccess={() => fetchStoryById(id as string)}
              >
                <Button className="w-full py-4 hover:bg-primary/90 transition cursor-pointer">
                  Edit Metadata
                </Button>
              </EditStorySheet>
              <Link href={`/owner/stories/${story.id}`}>
                <Button className="w-full py-4 hover:bg-primary/90 transition cursor-pointer mt-3">
                  View Story
                </Button>
              </Link>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="space-y-3">
              <div
                onClick={() => setOpenImageDialog(true)}
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
                open={openImageDialog}
                onOpenChange={(val) => {
                  setOpenImageDialog(val);
                  if (!val) {
                    setImageMode(null);
                    setImagePrompt("");
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
                          setImagePrompt(story.description || ""); // Auto-fill prompt from description
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
                        placeholder="Enter a short story description to base the image on..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                      />

                      <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                      >
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
                          <Button
                            className="w-full"
                            onClick={async () => {
                              const imgRes = await fetch(aiImagePreviewUrl);
                              const blob = await imgRes.blob();
                              const file = new File(
                                [blob],
                                "ai-generated.png",
                                {
                                  type: blob.type,
                                }
                              );

                              const formData = new FormData();
                              formData.append("file", file);

                              const uploadRes = await fetch("/api/cdn/upload", {
                                method: "POST",
                                body: formData,
                              });
                              const uploadJson = await uploadRes.json();

                              if (!uploadJson.url)
                                return alert("Upload failed");

                              const updated = {
                                ...story!,
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
                                setStory(updated);
                                setOpenImageDialog(false);
                                setAiImagePreviewUrl(null);
                                setImagePrompt("");
                              } else {
                                alert("Failed to update story");
                              }
                            }}
                          >
                            Use This Image
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <div className="flex items-center gap-2">
                <span className="font-bold">ID:</span>
                <span>{story.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Title:</span>
                <span>{story.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Author:</span>
                <span>{story.author || "N/A"}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold">Desc:</span>
                <span>{story.description || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Age range:</span>
                <Badge>{story.ageRange}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Reading level:</span>
                <Badge>{story.readingLevel}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Language:</span>
                <Badge>{story.language}</Badge>
              </div>
              {story.tags && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">Tags:</span>
                  {Array.isArray(story.tags)
                    ? story.tags.map((tag, id) => (
                        <Badge key={id} className="text-xs">
                          {tag.name}
                        </Badge>
                      ))
                    : story.tags.tagNames?.map((tag, id) => (
                        <Badge key={id} className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-primary-foreground p-4 rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-2">
            <ScrollArea className="flex-1 pr-2">
              <PanelEditor
                panels={story.panels}
                panelContents={panelContents}
                setPanelContents={setPanelContents}
                currentPanelIndex={currentPanelIndex}
              />
            </ScrollArea>
          </ScrollArea>
          <Button
            variant={confirmingDelete ? "destructive" : "outline"}
            className={`h-10 cursor-pointer px-2 text-sm transition-all duration-300 overflow-hidden ${
              confirmingDelete ? "w-[90px]" : "w-10"
            }`}
            onClick={() => {
              if (story.panels.length <= 1) return;
              if (confirmingDelete) {
                const updatedPanels = story.panels.filter(
                  (_, i) => i !== currentPanelIndex
                );
                const updatedContents = panelContents.filter(
                  (_, i) => i !== currentPanelIndex
                );
                setStory({ ...story, panels: updatedPanels });
                setPanelContents(updatedContents);
                setCurrentPanelIndex((prev) => Math.max(prev - 1, 0));
                setConfirmingDelete(false);
              } else {
                setConfirmingDelete(true);
              }
            }}
            disabled={story.panels.length <= 1}
          >
            {confirmingDelete ? (
              "Confirm?"
            ) : (
              <Trash2 className="w-4 h-4 mx-auto text-red-400" />
            )}
          </Button>

          {story.panels.length > 1 ? (
            <div className="flex justify-between items-center w-full py-2 px-4 border rounded-md mt-4">
              <Button
                variant="outline"
                className="w-10 h-10 cursor-pointer"
                onClick={() =>
                  setCurrentPanelIndex((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentPanelIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="font-semibold text-sm">
                Panel {currentPanelIndex + 1} of {story.panels.length}
              </div>

              {currentPanelIndex === story.panels.length - 1 ? (
                <Button
                  variant="outline"
                  className="w-10 h-10 cursor-pointer"
                  onClick={() => {
                    const newPanelNumber = story.panels.length;
                    const newPanel = {
                      content: "",
                      imageUrl: "",
                      audioUrl: "",
                      isEndPanel: false,
                      languageCode: story.language,
                      panelNumber: newPanelNumber,
                    };

                    setStory({
                      ...story,
                      panels: [...story.panels, newPanel],
                    });

                    setPanelContents([...panelContents, ""]);
                    setCurrentPanelIndex(newPanelNumber);
                  }}
                >
                  <Plus className="w-4 h-4 text-green-400" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-10 h-10 cursor-pointer"
                  onClick={() =>
                    setCurrentPanelIndex((prev) =>
                      Math.min(prev + 1, story.panels.length - 1)
                    )
                  }
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                if (!story) return;

                const newPanelNumber = story.panels.length;
                const newPanel = {
                  content: "",
                  imageUrl: "",
                  audioUrl: "",
                  isEndPanel: false,
                  languageCode: story.language,
                  panelNumber: newPanelNumber,
                };

                setStory({
                  ...story,
                  panels: [...story.panels, newPanel],
                });

                setPanelContents([...panelContents, ""]);
                setCurrentPanelIndex(newPanelNumber);
              }}
            >
              <Plus /> Add Panel
            </Button>
          )}
        </div>

        <div className="pt-2 border-t mt-2">
          <Button
            className="w-full py-4 hover:bg-primary/90 transition"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
