"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StoryDetails } from "@/app/types/story";
import Link from "next/link";
import WritingAnimation from "@/components/misc/animated-icons/Writing";
import CreateStoryForm from "@/components/CreateStoryForm";

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [userStories, setUserStories] = useState<StoryDetails[]>([]);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"manual" | "ai" | null>(null);
  const [ageRange, setAgeRange] = useState<string>("");
  const [generateAudio, setGenerateAudio] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("cartoonish");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ENG");

  const router = useRouter();

  useEffect(() => {
    fetch("/api/stories/me")
      .then((res) => res.json())
      .then((json) => {
        const stories = json.data?.data?.items ?? [];
        setUserStories(stories);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filtered = userStories.filter(
    (story) =>
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      (story.author || "").toLowerCase().includes(search.toLowerCase())
  );

  // Manual
  const handleCreate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author: "Super Admin",
          description: "",
          isDraft: true,
          coverImageUrl: "",
          language: "",
          duration: 0,
          ageRange: "",
          readingLevel: "",
          storyType: "",
          isAIGenerated: false,
          backgroundMusicUrl: "",
          panels: [
            {
              panelNumber: 1,
              content: "",
              imageUrl: "",
              audioUrl: "",
              isEndPanel: false,
              languageCode: "en",
            },
          ],
          tags: {
            tagNames: [],
          },
        }),
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const text = await res.text();
        console.error("API Error Response:", text);
        throw new Error("Failed to create story");
      }

      const json = contentType?.includes("application/json")
        ? await res.json()
        : null;
      const newId = json?.data?.id;

      if (newId) {
        setOpen(false);
        router.push(`/owner/write-story/${newId}`);
      } else {
        throw new Error("No ID returned");
      }
    } catch (err) {
      console.error("Failed to create story:", err);
    } finally {
      setGenerating(false);
    }
  };

  // AI voodoo
  const handleAIGenerate = async () => {
    setGenerating(true);
    try {
      // Story generation
      const storyRes = await fetch("/api/stories/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "Gemini",
          prompt: prompt,
          options: {
            temperature: 0.8,
            topP: 0.9,
            topK: 30,
            maxOutputTokens: 1500,
            stopSequences: [],
            seed: 123,
            additionalSystemInstruction: `Generate a story suitable for children aged ${ageRange} with the given title.

            The story must follow this structure:
            - An opening that introduces the main character(s) and setting.
            - A middle section with multiple story events, separated by blank lines between paragraphs. Each paragraph should describe a meaningful event or moment.
            - A closing that wraps up the story with a lesson or emotional ending.

            Use a warm, gentle, educational tone. Language should be simple and easy to understand.`,
          },
        }),
      });

      const storyJson = await storyRes.json();
      const newStory = storyJson.data;

      let coverImageUrl = "";
      let audioUrl = "";

      // Image Generation
      if (generateImage) {
        const descriptionToTranslate = newStory.content || prompt;

        // Translation
        const translationRes = await fetch("/api/stories/ai/translation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            receivedPrompt: descriptionToTranslate,
          }),
        });

        const translatedJson = await translationRes.json();
        const translatedDescription =
          translatedJson?.data || descriptionToTranslate;

        // Translation -> Generate
        const imageRes = await fetch("/api/stories/ai/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            translatedDescription,
            colorStyle: selectedStyle,
            width: 512,
            height: 512,
            modelId: "flux",
          }),
        });

        const imageJson = await imageRes.json();
        const base64Url = imageJson.url || imageJson.data?.url;

        if (!base64Url?.startsWith("data:image/")) {
          throw new Error("Invalid image data");
        }

        function dataURLtoBlob(dataUrl: string) {
          const [header, base64] = dataUrl.split(",");
          const mime = header.match(/:(.*?);/)?.[1] || "image/png";
          const binary = atob(base64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          return new Blob([array], { type: mime });
        }

        const imgBlob = dataURLtoBlob(base64Url);
        const file = new File([imgBlob], "cover.png", { type: "image/png" });

        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/cdn/upload", {
          method: "POST",
          body: formData,
        });

        const json = await uploadRes.json();
        coverImageUrl = json?.data?.url || json?.url;
      }

      // TTS
      if (generateAudio) {
        let ttsPath = "/api/stories/ai/tts";
        let ttsBody: TTSBody;

        if (selectedLanguage === "VIE") {
          ttsPath = "/api/stories/ai/tts/vietteltts";
          const body: ViettelTTSBody = {
            text: newStory.content,
            voiceID: selectedVoice || "hcm-diemmy",
            speed: 1,
            withoutFilter: false,
          };
          ttsBody = body;
        } else if (selectedLanguage === "ENG") {
          ttsPath = "/api/stories/ai/tts/pollinationai";
          const body: PollinationTTSBody = {
            text: newStory.content,
            voiceId: selectedVoice || "alloy",
          };
          ttsBody = body;
        } else {
          const body: FallbackTTSBody = {
            text: newStory.content,
          };
          ttsBody = body;
        }

        const ttsRes = await fetch(ttsPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ttsBody),
        });

        // Check for server error
        if (!ttsRes.ok) {
          console.error(`TTS generation failed with status ${ttsRes.status}`);
        } else {
          const audioBlob = await ttsRes.blob();
          const file = new File([audioBlob], "tts.mp3", { type: "audio/mpeg" });
          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await fetch("/api/cdn/upload", {
            method: "POST",
            body: formData,
          });

          const json = await uploadRes.json();
          audioUrl = json?.data?.url || json?.url;
        }
      }

      // Story
      const createRes = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStory,
          title,
          isAIGenerated: true,
          isDraft: true,
          panels: [
            {
              panelNumber: 1,
              content: newStory.content,
              imageUrl: "",
              audioUrl,
              isEndPanel: false,
              languageCode: "en",
            },
          ],
          tags: { tagNames: newStory.tags || [] },
          coverImageUrl,
          language: "ENG",
          author: "Super Admin",
        }),
      });

      const result = await createRes.json();
      const newId = result?.data?.id;

      if (!newId) throw new Error("Story creation failed");

      setOpen(false);
      router.push(`/owner/write-story/${newId}`);
    } catch (error) {
      console.error("AI generate error:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleOptimizedPrompt = async () => {
    setOptimizing(true);
    try {
      const res = await fetch("/api/stories/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receivedPrompt: prompt }),
      });

      const json = await res.json();
      const optimized = json?.data || json?.content;

      if (optimized) {
        setPrompt(optimized.trim());
      }
    } catch (err) {
      console.error("Failed to optimize prompt:", err);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <Input
        type="text"
        placeholder="Search title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded w-full"
      />

      <div className="bg-card mt-4 p-5 rounded-lg h-[80vh]">
        {userStories.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-full aspect-[2/3] bg-muted rounded-xl" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="w-full h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
              <div
                onClick={() => setOpen(true)}
                className="space-y-2 cursor-pointer hover:opacity-90 transition"
              >
                <div className="relative w-full aspect-[2/3] bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-primary">
                  <PlusCircle className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-sm font-semibold text-muted-foreground">
                  Super Admin
                </h1>
                <h1 className="text-xl font-semibold">Add New Story</h1>
              </div>

              {filtered.map((story) => (
                <Link
                  key={story.id}
                  href={`/owner/write-story/${story.id}`}
                  className="space-y-2 cursor-pointer hover:opacity-90 transition"
                >
                  <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl">
                    {story.coverImageUrl?.startsWith("http") ? (
                      <Image
                        src={story.coverImageUrl}
                        alt={story.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground font-medium">
                        No Image
                      </div>
                    )}
                  </div>
                  <h1 className="text-sm font-semibold text-muted-foreground">
                    {story.author || "Unknown Author"}
                  </h1>
                  <h1 className="text-xl font-semibold">{story.title}</h1>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setMode(null);
            setTitle("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Story</DialogTitle>
          </DialogHeader>

          {!mode && (
            <div className="justify-between gap-2 space-y-2">
              <Button
                className="w-full cursor-pointer"
                onClick={() => setMode("manual")}
              >
                Manual
              </Button>
              <Button
                className="w-full cursor-pointer"
                onClick={() => setMode("ai")}
              >
                AI Generate
              </Button>
            </div>
          )}

          {mode === "manual" &&
            (generating ? (
              <div className="flex justify-center items-center h-40">
                <WritingAnimation />
              </div>
            ) : (
              <>
                <Input
                  placeholder="Story title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Button
                  className="w-full"
                  disabled={!title}
                  onClick={handleCreate}
                >
                  Create Manually
                </Button>
              </>
            ))}

          {mode === "ai" &&
            (generating ? (
              <div className="flex justify-center items-center h-40">
                <WritingAnimation />
              </div>
            ) : (
              <CreateStoryForm
                title={title}
                setTitle={setTitle}
                prompt={prompt}
                setPrompt={setPrompt}
                ageRange={ageRange}
                setAgeRange={setAgeRange}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                generateAudio={generateAudio}
                setGenerateAudio={setGenerateAudio}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
                generateImage={generateImage}
                setGenerateImage={setGenerateImage}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                optimizing={optimizing}
                handleOptimizedPrompt={handleOptimizedPrompt}
                handleAIGenerate={handleAIGenerate}
              />
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
