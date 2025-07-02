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

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [userStories, setUserStories] = useState<StoryDetails[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/stories/user/published/46dcf0ac-19d2-4529-9834-20250580220b")
      .then((res) => res.json())
      .then((json) => {
        const stories = Array.isArray(json.data)
          ? json.data
          : json.data?.data || [];
        setUserStories(stories);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filtered = userStories.filter(
    (story) =>
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      (story.author || "").toLowerCase().includes(search.toLowerCase())
  );

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
              {/* Add New Story Card */}
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

              {/* Actual stories */}
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

      {/* Create story dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Story</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Story title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={handleCreate} disabled={!title || loading}>
            {loading ? "Creating..." : "Create and Continue"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
