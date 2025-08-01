"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PendingStory } from "./PendingStory";
import { PendingStoryRequest, PublishedStories } from "@/app/types/story";
import { Loader2Icon } from "lucide-react";

type Props = {
  stories: PublishedStories[];
  statusFilter: "Pending" | "Published" | "Featured";
  pendingStories: PendingStoryRequest[];
  filtered: PublishedStories[];
};

export default function ManageStoryGrid({
  stories,
  statusFilter,
  pendingStories,
  filtered,
}: Props) {
  if (statusFilter === "Pending") {
    return pendingStories.length === 0 ? (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2Icon className="w-15 h-15 animate-spin text-muted-foreground" />
      </div>
    ) : (
      <ScrollArea className="h-full w-full pr-4">
        <div className="flex flex-col gap-4">
          <PendingStory items={pendingStories} />
        </div>
      </ScrollArea>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2Icon className="w-15 h-15 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full pr-4">
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

              {statusFilter === "Published" && story.isFeatured && (
                <div className="absolute top-1 right-1">
                  <Badge
                    variant="secondary"
                    className="absolute top-1 right-1 bg-amber-400"
                  >
                    Featured
                  </Badge>
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
  );
}
