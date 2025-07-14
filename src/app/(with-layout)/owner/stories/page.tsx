"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { PendingStoryRequest, StoryDetails } from "@/app/types/story";
import Link from "next/link";
import { AgeGroupFilter } from "@/components/AgeGroupFilter";
import { PendingStory } from "@/components/PendingStory";

export default function StoriesManagement() {
  const [search, setSearch] = useState("");
  const [userStories, setUserStories] = useState<StoryDetails[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "Published" | "Pending" | "Featured"
  >("Published");
  const [pendingStories, setPendingStories] = useState<PendingStoryRequest[]>(
    []
  );

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

  useEffect(() => {
    fetch("/api/stories/pending?page=1&pageSize=10")
      .then((res) => res.json())
      .then((data) => {
        setPendingStories(data?.data.items || []);
      });
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
    )
    .filter((story) => {
      if (statusFilter === "Published") return story.isPublished;
      if (statusFilter === "Pending") return !story.isPublished;
      if (statusFilter === "Featured") return story.isFeatured;
      return true;
    });

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
          <div
            onClick={() => setStatusFilter("Published")}
            className={`p-3 rounded-md text-sm font-medium cursor-pointer transition-colors mb-2 ${
              statusFilter === "Published"
                ? "bg-muted text-white"
                : "bg-card hover:bg-muted/70"
            }`}
          >
            Published Stories
          </div>

          <div
            onClick={() => setStatusFilter("Featured")}
            className={`p-3 rounded-md text-sm font-medium cursor-pointer transition-colors mb-2 ${
              statusFilter === "Featured"
                ? "bg-muted text-white"
                : "bg-card hover:bg-muted/70"
            }`}
          >
            Featured Stories
          </div>

          <div
            onClick={() => setStatusFilter("Pending")}
            className={`p-3 rounded-md text-sm font-medium cursor-pointer transition-colors mb-2 ${
              statusFilter === "Pending"
                ? "bg-muted text-white"
                : "bg-card hover:bg-muted/70"
            }`}
          >
            Pending Approval
          </div>

          <div className="my-3 border-t border-border" />

          <AgeGroupFilter selected={selectedAges} onChange={toggleAge} />
        </ScrollArea>
      </div>

      {/* RIGHT*/}
      <div className="w-3/4 bg-card rounded-lg p-5 h-full">
        {statusFilter === "Pending" ? (
          pendingStories.length === 0 ? (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-muted-foreground text-sm">
                It&apos;s empty .3.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full w-full">
              <PendingStory items={pendingStories} />
            </ScrollArea>
          )
        ) : userStories.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-full aspect-[2/3] bg-muted rounded-xl" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-full w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filtered.map((story) => (
                <Link
                  key={story.id}
                  href={`/owner/stories/${story.id}`}
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
    </div>
  );
}
