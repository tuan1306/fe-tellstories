"use client";

import { useState } from "react";
import Image from "next/image";
import { StoryDetails } from "@/app/types/story";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function DataTable({ stories }: { stories: StoryDetails[] }) {
  const [search, setSearch] = useState("");

  const filtered = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      (story.author || "").toLowerCase().includes(search.toLowerCase())
  );

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
              <Link
                key={story.id}
                href={`/owner/published-stories/${story.id}`}
              >
                <div className="space-y-2 cursor-pointer hover:opacity-90 transition">
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
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
