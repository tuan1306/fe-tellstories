"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { StoryDetails } from "@/app/types/story";
import Link from "next/link";
import { AgeGroupFilter } from "@/components/AgeGroupFilter";

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [userStories, setUserStories] = useState<StoryDetails[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);

  const toggleAge = (age: string) => {
    setSelectedAges((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  };

  useEffect(() => {
    fetch("/api/stories/")
      .then((res) => res.json())
      .then((json) => {
        const stories = Array.isArray(json.data)
          ? json.data
          : json.data?.data || [];
        setUserStories(stories);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filtered = userStories
    .filter(
      (story) =>
        story.title.toLowerCase().includes(search.toLowerCase()) ||
        (story.author || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (story) =>
        selectedAges.length === 0 || selectedAges.includes(story.ageRange || "")
    );

  return (
    <div className="flex gap-6 mt-4 h-[90vh]">
      {/* LEFT */}
      <div className="w-1/4 bg-card rounded-lg p-4 space-y-4 overflow-auto">
        <Input
          type="text"
          placeholder="Search title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea>
          <AgeGroupFilter selected={selectedAges} onChange={toggleAge} />
        </ScrollArea>
      </div>

      {/* RIGHT*/}
      <ScrollArea className="w-3/4 bg-card rounded-lg p-5 h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filtered.map((story) => (
            <Link
              key={story.id}
              href={`/owner/published-stories/${story.id}`}
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
    </div>
  );
}
