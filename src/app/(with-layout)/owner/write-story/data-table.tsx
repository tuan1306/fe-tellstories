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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WritingAnimation from "@/components/misc/animated-icons/Writing";
import { Checkbox } from "@/components/ui/checkbox";

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [userStories, setUserStories] = useState<StoryDetails[]>([]);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"manual" | "ai" | null>(null);
  const [ageRange, setAgeRange] = useState<string | undefined>(undefined);
  const [generateAudio, setGenerateAudio] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);

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
    setLoading(true);
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
      setLoading(false);
    }
  };

  // AI voodoo
  const handleAIGenerate = async () => {
    setLoading(true);
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
            maxOutputTokens: 8000,
            stopSequences: [],
            seed: 123,
            additionalSystemInstruction: `Generate a story suitable for children aged ${ageRange} with the given title.`,
          },
        }),
      });

      const storyJson = await storyRes.json();
      const newStory = storyJson.data[0];

      let coverImageUrl = "";
      let audioUrl = "";

      // Image Generation
      if (generateImage) {
        const imageRes = await fetch("/api/stories/ai/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description: newStory.description || prompt,
          }),
        });

        const imgBlob = await imageRes.blob();
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
        const ttsRes = await fetch("/api/stories/ai/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: newStory.title,
            voiceId: "alloy",
          }),
        });

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
      setLoading(false);
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
            setPrompt("");
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
            (loading ? (
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
            (loading ? (
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

                <Textarea
                  className="w-full h-40"
                  placeholder="Describe what the story should be about..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />

                <Select value={ageRange} onValueChange={setAgeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3</SelectItem>
                    <SelectItem value="3-5">3-5</SelectItem>
                    <SelectItem value="5-8">5-8</SelectItem>
                    <SelectItem value="8-10">8-10</SelectItem>
                    <SelectItem value="10+">10+</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generate-audio"
                      checked={generateAudio}
                      onCheckedChange={(checked) => setGenerateAudio(!!checked)}
                    />
                    <label
                      htmlFor="generate-audio"
                      className="text-sm font-medium leading-none"
                    >
                      Generate TTS Audio
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generate-image"
                      checked={generateImage}
                      onCheckedChange={(checked) => setGenerateImage(!!checked)}
                    />
                    <label
                      htmlFor="generate-image"
                      className="text-sm font-medium leading-none"
                    >
                      Generate Cover Image
                    </label>
                  </div>
                </div>

                <Button disabled={!prompt} onClick={handleAIGenerate}>
                  Generate with AI
                </Button>
              </>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
