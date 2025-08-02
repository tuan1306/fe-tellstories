"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoryEditDetails } from "@/app/types/story";
import { EditStorySheet } from "@/components/EditStorySheet";

interface StoryMetadataCardProps {
  story: StoryEditDetails;
  onMetadataUpdate: () => void;
}

export function StoryMetadataCard({
  story,
  onMetadataUpdate,
}: StoryMetadataCardProps) {
  return (
    <div className="mb-4">
      <div className="w-full">
        <h1 className="text-xl font-semibold">Story Details</h1>
        <h1 className="text-sm text-muted-foreground">
          Key details and metadata about this story
        </h1>
      </div>
      <div className="pb-2 border-b mt-4">
        <EditStorySheet story={story} onSuccess={onMetadataUpdate}>
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
  );
}
