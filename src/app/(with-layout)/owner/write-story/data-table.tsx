"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DataTable() {
  const [search, setSearch] = useState("");

  const placeholderStories = [
    { id: "new-1", title: "Add New Story", author: "Admin" },
  ];

  const filtered = placeholderStories.filter(
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
                href={`/owner/write-story/${story.id}`}
                className="space-y-2 cursor-pointer hover:opacity-90 transition"
              >
                <div className="relative w-full aspect-[2/3] bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-primary">
                  <PlusCircle className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-sm font-semibold text-muted-foreground">
                  {story.author}
                </h1>
                <h1 className="text-xl font-semibold">{story.title}</h1>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
