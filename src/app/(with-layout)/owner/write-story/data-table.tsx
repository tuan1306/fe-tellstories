"use client";

import { useState } from "react";
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

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const placeholderStories = [
    { id: "new-1", title: "Add New Story", author: "Admin" },
  ];

  const filtered = placeholderStories.filter(
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
      <input
        type="text"
        placeholder="Search title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded w-full"
      />

      <div className="bg-card mt-4 p-5 rounded-lg h-[80vh]">
        <ScrollArea className="w-full h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
            {filtered.map((story) => (
              <div
                key={story.id}
                onClick={() => setOpen(true)}
                className="space-y-2 cursor-pointer hover:opacity-90 transition"
              >
                <div className="relative w-full aspect-[2/3] bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-primary">
                  <PlusCircle className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-sm font-semibold text-muted-foreground">
                  {story.author}
                </h1>
                <h1 className="text-xl font-semibold">{story.title}</h1>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Create story title confirmation */}
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
